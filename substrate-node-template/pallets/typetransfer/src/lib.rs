#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, ensure,
	traits::{Get},
	traits::{Currency, ExistenceRequirement},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
//use sp_runtime::traits::StaticLookup;
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

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		Something get(fn something): Option<u32>;

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
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;

		fn deposit_event() = default;

		#[weight = 0]
		pub fn buytransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_amount: u64) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			//验证交易是否属于粉尘攻击（连续交易或交易金额过低）
			//校验PS交易行为是否存在异常

			T::Currency::transfer(&sender, &ps_addr, contract_price, ExistenceRequirement::KeepAlive)?;

			Ok(())
		}

		#[weight = 0]
		pub fn selltransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_amount: u64) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			//验证交易是否属于粉尘攻击（连续交易或交易金额过低）
			//校验PS交易行为是否存在异常

			T::Currency::transfer(&ps_addr, &sender, contract_price, ExistenceRequirement::KeepAlive)?;

			Ok(())
		}

		#[weight = 0]
		pub fn algorithmtransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_amount: u64) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			//验证交易是否属于粉尘攻击（连续交易或交易金额过低）
			//校验PS交易行为是否存在异常

			T::Currency::transfer(&sender, &ps_addr, contract_price, ExistenceRequirement::KeepAlive)?;

			Ok(())
		}

		#[weight = 0]
		pub fn staketransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_amount: u64) -> dispatch::DispatchResult{

			Ok(())
		}

		#[weight = 0]
		pub fn incentivetransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_amount: u64) -> dispatch::DispatchResult{

			Ok(())
		}

		#[weight = 0]
		pub fn dividendtransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_amount: u64) -> dispatch::DispatchResult{

			Ok(())
		}
	}
}