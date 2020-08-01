#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, 
	traits::{Get},
	traits::{Currency, ExistenceRequirement},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
use primitives::{TypeTransfer, Token};
use frame_support::dispatch::DispatchResult;
use pallet_timestamp as timestamp;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

type BalanceOf<T> = <<T as Trait>::Currency as Currency<<T as system::Trait>::AccountId>>::Balance;

pub trait Trait: system::Trait+ timestamp::Trait{
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;

	type Currency: Currency<Self::AccountId>;
	type Token: Token<Self::AccountId>;
	type MinDustCheckBalance: Get<u32>;
	type MinDustCheckSeconds: Get<u32>;
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		DustCheckData get(fn dust_check_data): map hasher(blake2_128_concat) T::AccountId => Option<T::Moment>;
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
		pub fn buytransfer(origin, vpp_addr: T::AccountId, vpp_number: u64, payment_addr: T::AccountId, payment_token: u32) -> dispatch::DispatchResult{
			let _sender = ensure_signed(origin)?;
			Self::do_buytransfer(vpp_addr,vpp_number,payment_addr,payment_token)?;
			Ok(())
		}

		#[weight = 0]
		pub fn selltransfer(origin, ps_addr: T::AccountId, vpp_number: u64, payment_addr: T::AccountId, payment_token: u32) -> dispatch::DispatchResult{
			let _sender = ensure_signed(origin)?;
			Self::do_selltransfer(ps_addr, vpp_number, payment_addr, payment_token)?;
			Ok(())
		}

		#[weight = 0]
		pub fn algorithmtransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_token: u64) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			//验证交易是否属于粉尘攻击（连续交易或交易金额过低）
			//校验PS交易行为是否存在异常

			T::Currency::transfer(&sender, &ps_addr, contract_price, ExistenceRequirement::KeepAlive)?;

			Ok(())
		}

		#[weight = 0]
		pub fn staketransfer(origin, energy_token: u64) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;
			<Self as TypeTransfer<T::AccountId>>::staketransfer(&sender, energy_token)?;
			Ok(())
		}

		#[weight = 0]
		pub fn incentivetransfer(origin, incentive_addr: T::AccountId, incentive_status: bool, energy_token: u64) -> dispatch::DispatchResult{
		
			//调用token模块的incentivetoken函数，以实现奖惩激励功能
			T::Token::do_incentivetoken(incentive_addr, incentive_status, energy_token as u32)?;
			Ok(())
		}

		#[weight = 0]
		pub fn dividendtransfer(origin, ps_addr: T::AccountId, vpp_number: u64, contract_price: BalanceOf<T>, energy_token: u64) -> dispatch::DispatchResult{

			Ok(())
		}
	}
}

impl<T:Trait> TypeTransfer<T::AccountId> for Module<T> {
	fn do_selltransfer(ps_addr: T::AccountId, _vpp_number: u64, payment_addr: T::AccountId, payment_token: u32) -> DispatchResult {
		//验证交易是否属于粉尘攻击（连续交易或交易金额过低）
		//校验PS交易行为是否存在异常（检查交易金额合法性）

		//调用token模块transfertoken函数进行支付
		T::Token::do_transfertoken(ps_addr,payment_addr,payment_token)?;
		Ok(())
	}
	
	fn staketransfer(who: &T::AccountId, energy_token: u64) -> DispatchResult {
		//调用token模块的staketoken函数，以实现申请PS身份质押token功能
		T::Token::do_staketoken(who.clone(), energy_token as u32)?;

		Ok(())
	}

	fn do_buytransfer(vpp_addr: T::AccountId, _vpp_number: u64, payment_addr: T::AccountId, payment_token: u32) -> dispatch::DispatchResult {
		//验证交易是否属于粉尘攻击（连续交易或交易金额过低）
		//校验PS交易行为是否存在异常（检查交易金额合法性）

		//调用token模块transfertoken函数进行支付
		T::Token::do_transfertoken(vpp_addr,payment_addr,payment_token)?;
		Ok(())
	}
}

impl<T: Trait> Module<T> {

	//(smith)
	pub fn check_dust_attack(_sender: T::AccountId, _contract_price: BalanceOf<T>, _moment: T::Moment) -> bool {
		//策略1 交易间隔小于x秒
		//策略2  各个交易余额小于100
		// if (contract_price < T::MinDustCheckBalance::get() ) {
		// 	if (DustCheckData::<T>::contains_key(&sender)) {
		// 		let lastmoment = DustCheckData::<T>::get(&sender).unwrap();

		// 		if (moment - lastmoment < T::MinDustCheckSeconds::get()) {
		// 			<DustCheckData::<T>>::insert(sender, moment);
		// 			true
		// 		}
		// 	}
		// 	<DustCheckData::<T>>::insert(sender, moment);
		// }

		false
	}

	//(guobin)
	pub fn check_ps_exception() -> bool {
		true
	}
}
