#![cfg_attr(not(feature = "std"), no_std)]

/// A FRAME pallet proof of existence with necessary imports

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, ensure,
	traits::{Get},
	traits::{Currency},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
use sp_runtime::traits::StaticLookup;
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

	// 附加题答案
	type MaxClaimLength: Get<u32>;

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
	pub business_status: u8, 			//0 不营业  1 营业
	pub approval_status: u8, 			//0 不通过  1 通过  2 审核中
	pub device_id: u8,						   //设备编号
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct MultiRole {
	pub PU: bool,
	pub PG: bool,
	pub PS: bool,
	pub SG: bool,
	pub AS: bool,
	pub POM: bool,
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct PuRole {
	pub meter_code: Vec<u8>,			//电表编号
	pub meter_number: Vec<u8>,		//电表读数
	pub post_code: Vec<u8>,				  //邮编
}

// This pallet's storage items.
decl_storage! {
	// It is important to update your storage name so that your pallet's
	// storage items are isolated from other pallets.
	// ---------------------------------vvvvvvvvvvvvvv
	trait Store for Module<T: Trait> as TemplateModule {
		Proofs get(fn proofs): map hasher(blake2_128_concat) Vec<u8> => (T::AccountId, T::BlockNumber);

		Vpps get(fn vpps): map hasher(blake2_128_concat) (T::AccountId, u64) => Option<PsVpp<T>>;											//虚拟电厂申请列表
		Roles get(fn roles): map hasher(blake2_128_concat) T::AccountId => Option<MultiRole>;											  		   //身份属性
		Vppcounts get(fn vpp_counts): map hasher(blake2_128_concat) T::AccountId => u64;															 //PS申请虚拟电厂数量
		Transaction_amount get(fn transaction_amount): map hasher(blake2_128_concat) (T::AccountId, u64) => u64;			 //虚拟电厂交易额
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		ClaimCreated(AccountId, Vec<u8>),
		ClaimRevoked(AccountId, Vec<u8>),
	}
);

// The pallet's errors
decl_error! {
	pub enum Error for Module<T: Trait> {
		ProofAlreadyExist,
		ClaimNotExist,
		NotClaimOwner,
		ProofTooLong,
		IdentityAlreadyExist,
	}
}

// The pallet's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		// Initializing errors
		// this includes information about your errors in the node's metadata.
		// it is needed only if you are using errors in your pallet
		type Error = Error<T>;

		// Initializing events
		// this is needed only if you are using events in your pallet
		fn deposit_event() = default;

		#[weight = 0]
		pub fn create_claim(origin, claim: Vec<u8>) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;

			ensure!(!Proofs::<T>::contains_key(&claim), Error::<T>::ProofAlreadyExist);

			// 附加题答案
			ensure!(T::MaxClaimLength::get() >= claim.len() as u32, Error::<T>::ProofTooLong);

			Proofs::<T>::insert(&claim, (sender.clone(), system::Module::<T>::block_number()));

			Self::deposit_event(RawEvent::ClaimCreated(sender, claim));

			Ok(())
		}

		// 第二题答案
		#[weight = 0]
		pub fn transfer_claim(origin, claim: Vec<u8>, dest: <T::Lookup as StaticLookup>::Source) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;

			ensure!(Proofs::<T>::contains_key(&claim), Error::<T>::ClaimNotExist);

			let (owner, _block_number) = Proofs::<T>::get(&claim);

			ensure!(owner == sender, Error::<T>::NotClaimOwner);

			let dest = T::Lookup::lookup(dest)?;

			Proofs::<T>::insert(&claim, (dest, system::Module::<T>::block_number()));

			Ok(())
		}

		#[weight = 0]
		pub fn apply_ps(origin) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			Ok(())
		}

		#[weight = 0]
		pub fn apply_pg(origin) -> dispatch::DispatchResult{
			Ok(())
		}

		#[weight = 0]
		pub fn apply_pu(origin) -> dispatch::DispatchResult{
			Ok(())
		}

		#[weight = 0]
		pub fn transfer_token(origin)-> dispatch::DispatchResult{
			Ok(())
		}

	}
}
