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

		pub BuyRate get(fn buyrate):  u32;
		pub SellRate get(fn sellrate):  u32;
		pub BalanceToken get(fn balancetoken):  map hasher(blake2_128_concat) T::AccountId => u32;
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
		pub fn buytoken(origin, token: u32, treasure: T::AccountId, amount_price: BalanceOf<T>) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			BuyRate::put(112);

			//let amount = <BalanceOf<T>>::from(10);
			let amount = token * BuyRate::get() / 100;

			if(<BalanceOf<T>>::from(amount) == amount_price) {
				BalanceToken::<T>::insert(&sender, token);

				T::Currency::transfer(&sender, &treasure, amount_price, ExistenceRequirement::KeepAlive)?;
			}

			Ok(())
		}

		#[weight = 0]
		pub fn selltoken(origin, token: u32, treasure: T::AccountId, amount_price: BalanceOf<T>) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			SellRate::put(98);

			let amount = token * SellRate::get() / 100;

			if(<BalanceOf<T>>::from(amount) == amount_price) {
				let token_amount_now = <BalanceToken<T>>::get(&sender);
				BalanceToken::<T>::insert(&sender, token_amount_now - token);
				
				T::Currency::transfer(&treasure, &sender, amount_price, ExistenceRequirement::KeepAlive)?;
			}

			Ok(())
		}
	}
}
