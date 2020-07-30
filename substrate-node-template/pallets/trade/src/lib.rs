#![cfg_attr(not(feature = "std"), no_std)]

/// A FRAME pallet by which we handle the energy trading. 

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, ensure,
	traits::{Get},
	traits::{Currency},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
use codec::{Encode, Decode};
use primitives::{Vpp, ApprovalStatus, BusinessStatus, Role, Balance};
use frame_support::dispatch::DispatchResult;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

type BalanceOf<T> = <<T as Trait>::Currency as Currency<<T as system::Trait>::AccountId>>::Balance;

/// The pallet's configuration trait.
pub trait Trait: system::Trait {
	// Add other types and constants required to configure this pallet.

	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;

	type Currency: Currency<Self::AccountId>;
	type Role: Role<Self::AccountId>;
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct PsVpp<T: Trait> {
	pub vpp_name: Vec<u8>,
	pub pre_total_stock: u64,			//预售总额度
	pub sold_total: u64,					  //已售总额度
	pub electric_type: u8,  				//0直流 1交流
	pub buy_price: BalanceOf<T>,
	pub sell_price: BalanceOf<T>,
	pub post_code: Vec<u8>,
	pub transport_lose: u32, 			  //线损
	pub business_status: BusinessStatus, 			//0 不营业  1 营业
	pub approval_status: ApprovalStatus, 			  //0 不通过  1 通过  2 审核中
	pub device_id: u64,						   //设备编号
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct RoleInfo {
	pub meter_code: Vec<u8>,			//电表编号
	pub meter_number: Vec<u8>,		//电表读数
	pub post_code: Vec<u8>,				  //邮编
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		Vpps get(fn vpps): map hasher(blake2_128_concat) (T::AccountId, u64) => Option<PsVpp<T>>;																//虚拟电厂申请列表
		Vppcounts get(fn vpp_counts): map hasher(blake2_128_concat) T::AccountId => u64;															 					//PS申请虚拟电厂数量
		Transaction_amount get(fn transaction_amount): map hasher(blake2_128_concat) (T::AccountId, u64) => BalanceOf<T>;			 //虚拟电厂交易额
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		CreateVpp(AccountId, u8),
		LogoutRoled(AccountId, u8),
		/// VppStatusChanged(who, vpp_number, approval_status)
		VppApprovalStatusChanged(AccountId, u64, ApprovalStatus),
		/// VppStatusChanged(who, vpp_number, business_status)
		VppBusinessStatusChanged(AccountId, u64, BusinessStatus),
	}
);

// The pallet's errors
decl_error! {
	pub enum Error for Module<T: Trait> {
		VppNumberError,
		IdentityAlreadyExist,
		VppNotExist,
		Overflow,
		OnlyPsAllowed,
	}
}

// The pallet's dispatchable functions.
decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;

		fn deposit_event() = default;

		#[weight = 0]
		pub fn createvpp(
			origin, 
			vpp_name: Vec<u8>, 
			pre_total_stock: u64,
			sold_total: u64,					  //已售总额度
			electric_type: u8,   				//0直流 1交流
			buy_price: BalanceOf<T>,
			sell_price: BalanceOf<T>,
			post_code: Vec<u8>,
			transport_lose: u32, 			//线损
			business_status: BusinessStatus, 			//0 不营业  1 营业
			// approval_status: u8, 			//0 不通过  1 通过  2 审核中
			device_id: u64						   //设备编号
		) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			//check address identity
			ensure!(T::Role::has_role(&sender, 2), Error::<T>::OnlyPsAllowed);

			let idx = <Vppcounts<T>>::get(sender.clone());
			let next_id = idx.checked_add(1).ok_or(Error::<T>::Overflow)?;

			let new_vpp = Self::vpp_structure (
				vpp_name,
				pre_total_stock,
				sold_total,
				electric_type,
				buy_price,
				sell_price,
				post_code,
				transport_lose,
				business_status,
				ApprovalStatus::Pending,
			   device_id
		   );

			Vpps::<T>::insert((sender.clone(), idx), new_vpp);

			Vppcounts::<T>::insert(sender.clone(), next_id);

			Ok(())
		}

		#[weight = 0]
		pub fn editvpp(
			origin, 
			vpp_name: Vec<u8>, 
			pre_total_stock: u64,
			// sold_total: u64,					  //已售总额度
			electric_type: u8,   				//0直流 1交流
			buy_price: BalanceOf<T>,
			sell_price: BalanceOf<T>,
			// post_code: Vec<u8>,
			transport_lose: u32, 			//线损
			// business_status: BusinessStatus, 			//0 不营业  1 营业
			//approval_status: u8, 			//0 不通过  1 通过  2 审核中
			// device_id: u64,						   //设备编号
			vpp_number: u64
		) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;
			let vpp = <Vpps<T>>::get((&sender, vpp_number)).ok_or(Error::<T>::VppNotExist)?;

			let modify_vpp = PsVpp {
				 vpp_name,
				 pre_total_stock,
				 // sold_total,
				 electric_type,
				 buy_price,
				 sell_price,
				 // post_code,
				 transport_lose,
				 // business_status,
				 approval_status: ApprovalStatus::Pending,
				 // device_id,
				 ..vpp
			};

			Vpps::<T>::insert((sender.clone(), vpp_number), modify_vpp);

			Ok(())
		}

		#[weight = 0]
		pub fn setvppstatus(origin, #[compact] vpp_number: u64, status: BusinessStatus) -> dispatch::DispatchResult{		
			let sender = ensure_signed(origin)?;
			let mut vpp = <Vpps<T>>::get((&sender, vpp_number)).ok_or(Error::<T>::VppNotExist)?;
			if vpp.business_status != status {
				vpp.business_status = status;
				Vpps::<T>::insert((&sender, vpp_number), vpp);
				Self::deposit_event(RawEvent::VppBusinessStatusChanged(sender, vpp_number, status));
			}
			Ok(())
		}

		#[weight = 0]
		pub fn buyenergy(origin, buy_number: u8, amount_price: BalanceOf<T>) -> dispatch::DispatchResult{

			Ok(())
		}

		#[weight = 0]
		pub fn sellenergy(origin, sell_number: u8, amount_price: BalanceOf<T>) -> dispatch::DispatchResult{

			Ok(())
		}
	}
}

//noinspection RsUnresolvedReference
impl<T> Vpp<T::AccountId> for Module<T> where T: Trait {
	//noinspection ALL
	fn update_status(vpp: &T::AccountId, vpp_number: u64, approval_status: ApprovalStatus) ->  dispatch::DispatchResult {
		let mut ps_vpp = Vpps::<T>::get((vpp, vpp_number)).ok_or(Error::<T>::VppNotExist)?;
		if ps_vpp.approval_status != approval_status {
			ps_vpp.approval_status = approval_status;
			Vpps::<T>::insert((vpp, vpp_number), ps_vpp);
			Self::deposit_event(RawEvent::VppApprovalStatusChanged(vpp.clone(), vpp_number, approval_status));
		}
		Ok(())
	}

	fn buy(who: &T::AccountId, vpp: &T::AccountId, vpp_number: u64, price: Balance, energy_amount: u64) -> DispatchResult {
		Ok(())
	}

	fn vpp_exists(who: &T::AccountId, vpp_number: u64) -> bool {
		Vpps::<T>::contains_key((who, vpp_number))
	}
}

impl<T: Trait> Module<T> {
	fn vpp_structure(
			vpp_name: Vec<u8>, 
			pre_total_stock: u64,
			sold_total: u64,					  //已售总额度
			electric_type: u8,   				//0直流 1交流
			buy_price: BalanceOf<T>,
			sell_price: BalanceOf<T>,
			post_code: Vec<u8>,
			transport_lose: u32, 			//线损
			business_status: BusinessStatus, 			//0 不营业  1 营业
			approval_status: ApprovalStatus, 			//0 不通过  1 通过  2 审核中
			device_id: u64,						   //设备编号
	) ->  PsVpp::<T> {
		let vpp =  PsVpp::<T> {
			vpp_name: vpp_name,
			pre_total_stock: pre_total_stock,
			sold_total: sold_total,
			electric_type: electric_type,
			buy_price: buy_price,
			sell_price: sell_price,
			post_code: post_code,
			transport_lose: transport_lose,
			business_status: business_status,
			approval_status: approval_status,
			device_id: device_id,
		};

		vpp
	}
}
