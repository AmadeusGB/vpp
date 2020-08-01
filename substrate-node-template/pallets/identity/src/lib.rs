#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch,
	traits::{Get},
	traits::{Currency},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
use codec::{Encode, Decode};
use primitives::Role;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

/// The pallet's configuration trait.
pub trait Trait: system::Trait {
	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
	type Currency: Currency<Self::AccountId>;
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct MultiRole {
	pub pu: bool,
	pub pg: bool,
	pub ps: bool,
	pub sg: bool,
	pub ass: bool,
	pub pom: bool,
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
	trait Store for Module<T: Trait> as TemplateModule {
		Roles get(fn roles): map hasher(blake2_128_concat) T::AccountId => Option<MultiRole>;											  		   //身份属性
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		ApplyRoled(AccountId, u8),
		LogoutRoled(AccountId, u8),
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
		pub fn apply(origin, apply_role: u8) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			let mut ps_role = <Roles<T>>::get(sender.clone()).unwrap_or_else(|| MultiRole {
				pu: true,
				pg: false,
				ps: false,
				sg: false,
				ass: false,
				pom: false,
			});

			 match apply_role {
				0 => ps_role.pu = true,
				1 => ps_role.pg = true,
				2 => ps_role.ps = true,
				3 => ps_role.sg = true,
				4 => ps_role.ass = true,
				5 => ps_role.pom = true,
				_ => ps_role.pom = false,
			};

			Roles::<T>::insert(sender.clone(), ps_role);

			Self::deposit_event(RawEvent::ApplyRoled(sender, apply_role));

			Ok(())
		}

		#[weight = 0]
		pub fn logout(origin, apply_role: u8) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			let mut ps_role = <Roles<T>>::get(sender.clone()).unwrap_or_else(|| MultiRole {
				pu: true,
				pg: false,
				ps: false,
				sg: false,
				ass: false,
				pom: false,
			});

			 match apply_role {
				0 => ps_role.pu = false,
				1 => ps_role.pg = false,
				2 => ps_role.ps = false,
				3 => ps_role.sg = false,
				4 => ps_role.ass = false,
				5 => ps_role.pom = false,
				_ => ps_role.pom = false,
			};

			Roles::<T>::insert(sender.clone(), ps_role);

			Self::deposit_event(RawEvent::LogoutRoled(sender, apply_role));

			Ok(())
		}
	}
}

//noinspection RsUnresolvedReference
impl<T> Role<T::AccountId> for Module<T> where T: Trait {
	//noinspection ALL
	fn has_role(who: &T::AccountId, apply_role: u8) -> bool {
		let ps_role = <Roles<T>>::get(who).unwrap_or_else(|| MultiRole {
			pu: false,
			pg: false,
			ps: false,
			sg: false,
			ass: false,
			pom: false,
		});
		match apply_role {
			0 => ps_role.pu,
			1 => ps_role.pg,
			2 => ps_role.ps,
			3 => ps_role.sg,
			4 => ps_role.ass,
			5 => ps_role.pom,
			_ => false,
		}
	}
}
