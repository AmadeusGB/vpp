#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, 
	traits::{Currency},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
use codec::{Encode, Decode};
use primitives::{Vpp, Contract};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

//type BalanceOf<T> = <<T as Trait>::Currency as Currency<<T as system::Trait>::AccountId>>::Balance;

pub trait Trait: system::Trait {
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
	type Vpp: Vpp<Self::AccountId>;
	type Currency: Currency<Self::AccountId>;
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct ContractT<T: Trait> {
	pub ps_addr: T::AccountId,										//合同PS地址(通过地址和ID取得VPP所有信息)
	pub vpp_number: u64,											 //该地址下虚拟电厂ID
	pub block_number: T::BlockNumber,				   //合同创建时区块号
	pub contract_price: u32,		  			 //合同总价
	pub energy_amount: u64,							  			 //购买电能度数
	pub execution_status:u8,									  //合同执行状态（执行中：1，已完成：2，已终止：3）
	pub contract_type:bool,								 		   //合同分类（购买true/出售false）
	pub energy_type: u8,											  //能源类型（0：光电，1：风电，2：火电）
	pub ammeter_id: Vec<u8>,						 		   //消费者/生产者电表编号
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		Contracts get(fn contracts): map hasher(blake2_128_concat) (T::AccountId, u64) => Option<ContractT<T>>;
		SearchContracts get(fn searchcontracts): map hasher(blake2_128_concat) T::BlockNumber => (T::AccountId, u64);
		Contractcounts get(fn contractcounts): map hasher(blake2_128_concat) T::AccountId => u64;
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		ContractCraeted(AccountId, u64, u8),
		ContractExecutionStatusChanged(AccountId, u64, u8),		
	}
);

// The pallet's errors
decl_error! {
	pub enum Error for Module<T: Trait> {
		VppNotExist,
		ContractNotExist,
	}
}

// The pallet's dispatchable functions.
decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;

		fn deposit_event() = default;

		#[weight = 0]
		pub fn addcontract(
			origin, 
			ps_addr: T::AccountId,									   //签订该合同的PS地址(通过地址和ID取得VPP所有信息)
			vpp_number: u64,											//该地址下虚拟电厂ID
			contract_price: u32,		  			 //合同总价
			energy_amount: u64,							  			 //购买电能度数
			contract_type:bool,								 			//合同分类（购买/出售）
			energy_type: u8,											  //能源类型（0：光电，1：风电，2：火电）
			ammeter_id: Vec<u8> 									//电表编号
		) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;
			Self::do_addcontract(
				sender,
				ps_addr,									   //签订该合同的PS地址(通过地址和ID取得VPP所有信息)
				vpp_number,											//该地址下虚拟电厂ID
				contract_price,		  			 //合同总价
				energy_amount,							  			 //购买电能度数
				contract_type,								 			//合同分类（购买/出售）
				energy_type,											  //能源类型（0：光电，1：风电，2：火电）
				ammeter_id									//电表编号
			)?;
			Ok(())
		}

		#[weight = 0]
		pub fn stopcontract(
			origin, 
			contract_number: u64,
		) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;

			let mut contract = <Contracts<T>>::get((sender.clone(), contract_number)).ok_or(Error::<T>::ContractNotExist)?;

			if contract.execution_status != 3 {
				contract.execution_status = 3;					//合同执行状态（执行中：1，已完成：2，已终止：3）
				Contracts::<T>::insert((sender.clone(), contract_number), contract);
				Self::deposit_event(RawEvent::ContractExecutionStatusChanged(sender, contract_number, 3));
			}

			Ok(())
		}

		#[weight = 0]
		pub fn completecontract(
			_origin, 
		) -> dispatch::DispatchResult {
			//为简化，默认同一个电表，同一时间只有一个可执行合同；
			//合同开始执行，读取电表一个度数；
			//OCW按周期查询该电表度数；
			//当电表度数=电表度数（合同开始时刻）+购买电能度数，自动将合同标记为已完成

			Ok(())
		}

	}
}


impl<T:Trait> Contract<T::AccountId> for Module<T>{
	fn do_addcontract(
					sender: T::AccountId,		
					ps_addr: T::AccountId,									   //签订该合同的PS地址(通过地址和ID取得VPP所有信息)
					vpp_number: u64,											//该地址下虚拟电厂IDs
					contract_price: u32,		  			 					//合同总价
					energy_amount: u64,							  			 //购买电能度数
					contract_type:bool,								 			//合同分类（购买true/出售false）
					energy_type: u8,											  //能源类型（0：光电，1：风电，2：火电）
					ammeter_id: Vec<u8> 									//电表编号
					) -> dispatch::DispatchResult {
		// update the vpp
		//T::Vpp::buy(&sender, &ps_addr, vpp_number,contract_price ,energy_amount)?;

		let contract_number = <Contractcounts<T>>::get(sender.clone());
		let block_number_now = system::Module::<T>::block_number();
		let contract_template = ContractT::<T> {
			ps_addr: ps_addr,
			vpp_number: vpp_number,
			block_number: block_number_now,
			contract_price: contract_price,
			energy_amount: energy_amount,
			execution_status: 1,									//合同执行状态（执行中：1，已完成：2，已终止：3）
			contract_type: contract_type,
			energy_type: energy_type,
			ammeter_id: ammeter_id
		};

		Contracts::<T>::insert((sender.clone(), contract_number), contract_template);
		SearchContracts::<T>::insert(block_number_now, (sender.clone(), contract_number));
		Contractcounts::<T>::insert(sender.clone(), contract_number+1);

		Self::deposit_event(RawEvent::ContractCraeted(sender, contract_number, 1));
		
		Ok(())
	}
}

//fn from_balance_of<T:Trait>(b: BalanceOf<T>)->Balance{unsafe{*(&b as *const BalanceOf<T> as *const Balance)}}
//fn to_balance_of<T:Trait>(b: Balance)->BalanceOf<T>{unsafe{*(&b as *const Balance as *const BalanceOf<T>)}}
