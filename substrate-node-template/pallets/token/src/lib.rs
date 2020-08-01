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

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct TokenInfo {
	pub token_total: u32,
	pub token_stake: u32,
	pub token_vote: u32,
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		pub BuyRate get(fn buyrate):  u32;
		pub SellRate get(fn sellrate):  u32;
		pub BalanceToken get(fn balancetoken):  map hasher(blake2_128_concat) T::AccountId => Option<TokenInfo>;
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
		pub fn buytoken(origin, buy_token: u32, treasure: T::AccountId, amount_price: BalanceOf<T>) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			BuyRate::put(112);

			let amount = buy_token * BuyRate::get() / 100;

			if(<BalanceOf<T>>::from(amount) == amount_price) {
				let mut tokeninfo = <BalanceToken<T>>::get(&sender).unwrap_or_else(|| TokenInfo {
					token_total: 0,
					token_stake: 0,
					token_vote: 0,
				});
				tokeninfo.token_total += buy_token;

				BalanceToken::<T>::insert(&sender, tokeninfo);

				T::Currency::transfer(&sender, &treasure, amount_price, ExistenceRequirement::KeepAlive)?;
			}

			Ok(())
		}

		#[weight = 0]
		pub fn selltoken(origin, sell_token: u32, treasure: T::AccountId, amount_price: BalanceOf<T>) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			SellRate::put(98);

			let amount = sell_token * SellRate::get() / 100;

			if(<BalanceOf<T>>::from(amount) == amount_price) {
				let mut tokeninfo = <BalanceToken<T>>::get(&sender).unwrap_or_else(|| TokenInfo {
					token_total: 0,
					token_stake: 0,
					token_vote: 0,
				});
				tokeninfo.token_total -= sell_token;

				BalanceToken::<T>::insert(&sender, tokeninfo);
				
				T::Currency::transfer(&treasure, &sender, amount_price, ExistenceRequirement::KeepAlive)?;
			}

			Ok(())
		} 

		#[weight = 0]
		pub fn incentivetoken(origin, incentive_status: bool, incentive_token: u32) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			let mut tokeninfo = <BalanceToken<T>>::get(&sender).unwrap_or_else(|| TokenInfo {
				token_total: 0,
				token_stake: 0,
				token_vote: 0,
			});
			match incentive_status {
				true => tokeninfo.token_total += incentive_token,			//正向激励
				false => tokeninfo.token_total -= incentive_token,			//负向激励
			}

			BalanceToken::<T>::insert(&sender, tokeninfo);

			Ok(())
		}

		#[weight = 0]
		pub fn staketoken(origin, stake_token: u32) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			let mut tokeninfo = <BalanceToken<T>>::get(&sender).unwrap_or_else(|| TokenInfo {
				token_total: 0,
				token_stake: 0,
				token_vote: 0,
			});
			tokeninfo.token_total -= stake_token;
			tokeninfo.token_stake += stake_token;

			BalanceToken::<T>::insert(&sender, tokeninfo);

			Ok(())
		}

		#[weight = 0]
		pub fn votetoken(origin, vote_token: u32) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			let mut tokeninfo = <BalanceToken<T>>::get(&sender).unwrap_or_else(|| TokenInfo {
				token_total: 0,
				token_stake: 0,
				token_vote: 0,
			});
			tokeninfo.token_total -= vote_token;
			tokeninfo.token_vote += vote_token;

			BalanceToken::<T>::insert(&sender, tokeninfo);

			Ok(())
		}

	}
}
