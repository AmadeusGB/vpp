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
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct PsVpp<T: Trait> {
	pub ps_name: Vec<u8>,
	pub pre_total_stock: u64,			//预售总额度
	pub sold_total: u64,					  //已售总额度
	pub electric_type: u8,  				//0直流 1交流
	pub buy_price: BalanceOf<T>,
	pub sell_price: BalanceOf<T>,
	pub post_code: Vec<u8>,
	pub transport_lose: u32, 			//线损
	pub business_status: bool, 			//0 不营业  1 营业
	pub approval_status: u8, 			//0 不通过  1 通过  2 审核中
	pub device_id: u8,						   //设备编号
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
		Vpps get(fn vpps): map hasher(blake2_128_concat) (T::AccountId, u64) => Option<PsVpp<T>>;											//虚拟电厂申请列表
		Vppcounts get(fn vpp_counts): map hasher(blake2_128_concat) T::AccountId => u64;															 //PS申请虚拟电厂数量
		Transaction_amount get(fn transaction_amount): map hasher(blake2_128_concat) (T::AccountId, u64) => BalanceOf<T>;			 //虚拟电厂交易额
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		CreateVpp(AccountId, u8),
		LogoutRoled(AccountId, u8),
	}
);

// The pallet's errors
decl_error! {
	pub enum Error for Module<T: Trait> {
		ProofTooLong,
		IdentityAlreadyExist,
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
			ps_name: Vec<u8>, 
			pre_total_stock: u64,
			sold_total: u64,					  //已售总额度
			electric_type: u8,   				//0直流 1交流
			buy_price: BalanceOf<T>,
			sell_price: BalanceOf<T>,
			post_code: Vec<u8>,
			transport_lose: u32, 			//线损
			business_status: bool, 			//0 不营业  1 营业
			approval_status: u8, 			//0 不通过  1 通过  2 审核中
			device_id: u8						   //设备编号
		) -> dispatch::DispatchResult{

			Ok(())
		}

		#[weight = 0]
		pub fn editvpp(
			origin, 
			ps_name: Vec<u8>, 
			pre_total_stock: u64,
			sold_total: u64,					  //已售总额度
			electric_type: u8,   				//0直流 1交流
			buy_price: BalanceOf<T>,
			sell_price: BalanceOf<T>,
			post_code: Vec<u8>,
			transport_lose: u32, 			//线损
			business_status: bool, 			//0 不营业  1 营业
			approval_status: u8, 			//0 不通过  1 通过  2 审核中
			device_id: u8						   //设备编号
		) -> dispatch::DispatchResult{

			Ok(())
		}

		#[weight = 0]
		pub fn setvppstatus(origin, status: bool) -> dispatch::DispatchResult{

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
