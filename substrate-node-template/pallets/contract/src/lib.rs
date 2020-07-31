#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, ensure,
	traits::{Get},
	traits::{Currency},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
use codec::{Encode, Decode};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

type BalanceOf<T> = <<T as Trait>::Currency as Currency<<T as system::Trait>::AccountId>>::Balance;

pub trait Trait: system::Trait {
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;

	type Currency: Currency<Self::AccountId>;
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct ContractT<T: Trait> {
	pub ps_addr: T::AccountId,							//合同PS地址(通过地址和ID取得VPP所有信息)
	pub vpp_number: u64,											 //该地址下虚拟电厂ID
	pub block_number: T::BlockNumber,								//合同成交时区块号
	pub contract_price: BalanceOf<T>,		  //合同总价
	pub energy_amount: u64,							  //购买电能度数
	pub execution_status:u8,							//合同执行状态
	pub contract_type:bool,								 //合同分类（购买/出售）
	pub ammeter_id: Vec<u8>,						 //电表编号
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		Something get(fn something): Option<u32>;

		Contracts get(fn vpps): map hasher(blake2_128_concat) (T::AccountId, u64) => Option<ContractT<T>>;
		Contractcounts get(fn vpp_counts): map hasher(blake2_128_concat) T::AccountId => u64;
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		SomethingStored(u32, AccountId),
	}
);

// The pallet's errors
decl_error! {
	pub enum Error for Module<T: Trait> {
		NoneValue,
		StorageOverflow,
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
			ps_addr: T::AccountId,									   //合同PS地址(通过地址和ID取得VPP所有信息)
			vpp_number: u64,											//该地址下虚拟电厂ID
			block_number: u64,										   //合同成交时区块号
			contract_price: BalanceOf<T>,		  			 //合同总价
			energy_amount: u64,							  			 //购买电能度数
			execution_status:u8,									   //合同执行状态
			contract_type:bool,								 			//合同分类（购买/出售）
			ammeter_id: Vec<u8> 									//电表编号
		) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;

			let contract_number = <Contractcounts<T>>::get(sender.clone());
			let contract_template = ContractT::<T> {
				ps_addr: ps_addr,
				vpp_number: vpp_number,
				block_number: system::Module::<T>::block_number(),
				contract_price: contract_price,
				energy_amount: energy_amount,
				execution_status: execution_status,
				contract_type: contract_type,
				ammeter_id: ammeter_id
			};

			Contracts::<T>::insert((sender.clone(), contract_number), contract_template);
			Contractcounts::<T>::insert(sender.clone(), contract_number+1);

			Ok(())
		}

		#[weight = 0]
		pub fn stopcontract(
			origin, 
			contract_number: u64,
		) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;

			let contract = Contracts::<T>::get((sender.clone(), contract_number));

			Ok(())
		}

		#[weight = 0]
		pub fn completecontract(
			origin, 
		) -> dispatch::DispatchResult {
			Ok(())
		}

	}
}
