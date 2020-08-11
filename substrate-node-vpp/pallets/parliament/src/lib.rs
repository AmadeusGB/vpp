#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{decl_module, decl_storage, ensure, decl_event, decl_error, dispatch, traits::Get,};
//use frame_system::{self as system, ensure_root, ensure_signed};
use frame_system::{self as system, ensure_signed};
use primitives::{Vpp, ApprovalStatus, Parliament};
use sp_std::prelude::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

/// The pallet's configuration trait.
pub trait Trait: system::Trait {
	/// The overarching event type.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
	type Vpp: Vpp<Self::AccountId>;
	type MaxMemberCount: Get<usize>;
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		Members get(fn get_members): Vec<T::AccountId>;
		SuperOwner get(fn get_superowner): T::AccountId;
	}
}

// The pallet's events
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		ForceToAddMember(AccountId),
		ForceToRemoveMember(AccountId),
	}
);

// The pallet's errors
decl_error! {
	pub enum Error for Module<T: Trait> {
		AlreadyMember,
		NotMember,
		TooManyMembers,
	}
}

// The pallet's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		// Initializing errors
		type Error = Error<T>;

		// Initializing events
		fn deposit_event() = default;
/*
		#[weight = 0]
		pub fn init_superowner(
			origin
		) -> dispatch:: DispatchResult {
			let sender = ensure_signed(origin)?;
			SuperOwner::<T>::put(sender);

			Ok(())
		}
*/

		#[weight = 0]
		pub fn accept_vpp(
			origin, 
			who: T::AccountId, 
			idx: u64
		) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;
			let members = Self::get_members();
			// fixme: uncomment
			ensure!(members.contains(&sender), Error::<T>::NotMember);
			T::Vpp::update_status(&who, idx, ApprovalStatus::Passed)?;
			Ok(())
		}
	
		#[weight = 0]
		pub fn deny_vpp(
			origin, 
			who: T::AccountId, 
			idx: u64
		) -> dispatch::DispatchResult {
			let sender = ensure_signed(origin)?;
			let members = Self::get_members();
			// fixme: uncomment
			ensure!(members.contains(&sender), Error::<T>::NotMember);
			T::Vpp::update_status(&who, idx, ApprovalStatus::Denied)?;
			Ok(())
		}
	
		#[weight = 0]
		pub fn force_add_member(
			origin, 
			new_member: T::AccountId
		) -> dispatch::DispatchResult {
			ensure_signed(origin)?;
			let members = Self::get_members();
			ensure!(members.len() < T::MaxMemberCount::get(), Error::<T>::TooManyMembers);
			ensure!(!members.contains(&new_member), Error::<T>::AlreadyMember);
			Members::<T>::append(&new_member); 
			Self::deposit_event(RawEvent::ForceToAddMember(new_member));
			Ok(())
		}

		#[weight = 0]
		pub fn force_remove_member(
			origin, 
			old_member: T::AccountId
		) -> dispatch::DispatchResult {
			ensure_signed(origin)?;
			ensure!(Self::get_members().contains(&old_member), Error::<T>::NotMember);
			<Members<T>>::mutate(|mem| mem.retain(|m| m != &old_member));
			Self::deposit_event(RawEvent::ForceToRemoveMember(old_member));
			Ok(())
		}
	}
}

impl<T:Trait> Parliament<T::AccountId> for Module<T>{
	fn is_member(who: &T::AccountId) -> bool {
		Self::get_members().contains(&who)
	}
}
