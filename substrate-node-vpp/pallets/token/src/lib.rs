#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, ensure,
	traits::{Currency, ExistenceRequirement},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
//use sp_runtime::traits::StaticLookup;
use codec::{Encode, Decode};
use primitives::{Token, PTO, DOT};
use frame_support::dispatch::DispatchResult;

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
	pub token_balance: u32,						//可用余额
	pub token_stake: u32,						  //交易质押
	pub token_vote: u32,						   //投票质押
}

impl Default for TokenInfo {
	fn default() -> Self {
		TokenInfo {
			token_balance: 0,
			token_stake: 0,
			token_vote: 0,
		}
	}
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct RateInfo {
	pub buy_rate: u32,						//可用余额
	pub sell_rate: u32,						  //交易质押
}

impl Default for RateInfo {
	fn default() -> Self {
		RateInfo {
			buy_rate: 1,
			sell_rate: 1,
		}
	}
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		pub SelfRate get(fn selfrate): map hasher(blake2_128_concat) T::AccountId => RateInfo;									//地址对应汇率
		pub BalanceToken get(fn balancetoken):  map hasher(blake2_128_concat) T::AccountId => TokenInfo;		//某地址对应的通证数量
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		BuyToken(AccountId, u32, u32),
		SellToken(AccountId, u32, u32),
	}
);

// The pallet's errors
decl_error! {
	pub enum Error for Module<T: Trait> {
		TokenAcountNotExist,
		BalanceNotEnough,
	}
}

// The pallet's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;

		fn deposit_event() = default;

		#[weight = 0]
		pub fn buytoken(
			origin, 
			buy_token: u32, 
			treasure: T::AccountId, 
			amount_price: BalanceOf<T>
		) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;
			let mut rate = <SelfRate<T>>::get(&sender);
			let mut tokeninfo = <BalanceToken<T>>::get(&sender);
			tokeninfo.token_balance += buy_token;
			rate.buy_rate *= PTO / DOT;

			BalanceToken::<T>::insert(&sender, tokeninfo);
			SelfRate::<T>::insert(&sender, &rate);
			T::Currency::transfer(&sender, &treasure, amount_price, ExistenceRequirement::KeepAlive)?;

			Self::deposit_event(RawEvent::BuyToken(sender, buy_token, rate.buy_rate));

			Ok(())
		}

		#[weight = 0]
		pub fn selltoken(
			origin, 
			sell_token: u32, 
			treasure: T::AccountId, 
			amount_price: BalanceOf<T>
		) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;
			let mut rate = <SelfRate<T>>::get(&sender);
			let mut tokeninfo = <BalanceToken<T>>::get(&sender);
			ensure!(tokeninfo.token_balance > sell_token, Error::<T>::BalanceNotEnough);

			tokeninfo.token_balance -= sell_token;
			rate.buy_rate *= PTO / DOT;

			BalanceToken::<T>::insert(&sender, tokeninfo);
			SelfRate::<T>::insert(&sender, &rate);
			T::Currency::transfer(&treasure, &sender, amount_price, ExistenceRequirement::KeepAlive)?;

			Self::deposit_event(RawEvent::BuyToken(sender, sell_token, rate.sell_rate));

			Ok(())
		} 

		#[weight = 0]
		pub fn transfertoken(
			origin, 
			from: T::AccountId, 
			to: T::AccountId, 
			token_amount: u32
		) -> dispatch::DispatchResult{
			ensure_signed(origin)?;
			Self::do_transfertoken(from, to, token_amount)?;
			Ok(())
		}

		#[weight = 0]
		pub fn incentivetoken(
			origin, 
			incentive_status: bool, 
			incentive_token: u32
		) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;
			Self::do_incentivetoken(sender, incentive_status, incentive_token)?;
			Ok(())
		}

		#[weight = 0]
		pub fn staketoken(
			origin, 
			stake_token: u32
		) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;
			Self::do_staketoken(sender, stake_token)?;
			Ok(())
		}

		#[weight = 0]
		pub fn votetoken(
			origin, 
			vote_token: u32
		) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;
			Self::do_votetoken(sender, vote_token)?;
			Ok(())
		}

	}
}

impl<T:Trait> Token<T::AccountId> for Module<T>{
	fn do_incentivetoken(sender: T::AccountId,incentive_status: bool, incentive_token: u32) -> dispatch::DispatchResult {
		let mut tokeninfo = <BalanceToken<T>>::get(&sender);
		match incentive_status {
			true => tokeninfo.token_balance += incentive_token,				//正向激励
			false => tokeninfo.token_balance -= incentive_token,			//负向激励
		}
		BalanceToken::<T>::insert(&sender, tokeninfo);
		Ok(())
	}
	
	fn do_staketoken(sender: T::AccountId,stake_token:u32) -> dispatch::DispatchResult {
		let mut tokeninfo = <BalanceToken<T>>::get(&sender);
		tokeninfo.token_balance -= stake_token;
		tokeninfo.token_stake += stake_token;

		BalanceToken::<T>::insert(&sender, tokeninfo);
		Ok(())
	}
	
	fn do_votetoken(sender: T::AccountId,vote_token:u32) -> dispatch::DispatchResult {
		let mut tokeninfo = <BalanceToken<T>>::get(&sender);
		tokeninfo.token_balance -= vote_token;
		tokeninfo.token_vote += vote_token;

		BalanceToken::<T>::insert(&sender, tokeninfo);

		Ok(())
	}
	
	fn do_transfertoken(from: T::AccountId, to: T::AccountId, token_amount: u32) -> DispatchResult {
		let mut from_tokeninfo = <BalanceToken<T>>::get(&from);
		let mut to_tokeninfo = <BalanceToken<T>>::get(&to);

		ensure!(from_tokeninfo.token_balance > token_amount, Error::<T>::BalanceNotEnough);

		from_tokeninfo.token_balance -= token_amount;
		to_tokeninfo.token_balance += token_amount;
		Ok(())
	}
}
