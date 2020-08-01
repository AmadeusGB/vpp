#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, dispatch, ensure,
	traits::{Get},
	traits::{Currency, ExistenceRequirement},
};
use frame_system::{self as system, ensure_signed};
use sp_std::prelude::*;
use codec::{Encode, Decode};
use primitives::{TypeTransfer, Parliament};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

type BalanceOf<T> = <<T as Trait>::Currency as Currency<<T as system::Trait>::AccountId>>::Balance;

pub trait Trait: system::Trait {
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;

	type Currency: Currency<Self::AccountId>;
	type TypeTransfer: TypeTransfer<Self::AccountId>;
	type Parliament: Parliament<Self::AccountId>;
}

#[cfg_attr(feature = "std", derive(Debug, PartialEq, Eq))]
#[derive(Encode, Decode)]
pub struct ProposalInfo {
	pub apply_role: u8,							   //申请角色（0:pu, 1:pg，2:ps，3:sg，4:ass）
	pub apply_status: u8,						//提案状态（0：待通过，1：已通过，2：已拒绝）
	pub apply_annex: bool,					 //附件情况（0:无附件，1:有附件）
}

// This pallet's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		Something get(fn something): Option<u32>;

		pub ProposalCount get(fn proposalcount):  u32;
		pub ProposalInformation get(fn proposalinformation):  map hasher(blake2_128_concat) u32 => Option<ProposalInfo>;
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
		ProposalNotExist,
	}
}

// The pallet's dispatchable functions.
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;

		fn deposit_event() = default;

		#[weight = 0]
		pub fn applyproposalrole(origin, apply_role: u8, apply_annex: bool) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			if(apply_role == 2) {
				//调用typetransfer模块staketransfer质押函数
				T::TypeTransfer::staketransfer(&sender, 0)?;
			}

			let Proposal_number = ProposalCount::get();
			let proposal_template = ProposalInfo {
				apply_role: apply_role,
				apply_status: 0,
				apply_annex: apply_annex,
			};

			ProposalInformation::insert(Proposal_number, proposal_template);

			Ok(())
		}

		#[weight = 0]
		pub fn setproposalrole(origin, proposal_number: u32, vote_result: u8) -> dispatch::DispatchResult{
			let sender = ensure_signed(origin)?;

			//检查当前sender是否为委员会成员
			if T::Parliament::is_member(&sender) {
				let mut proposal_information = <ProposalInformation>::get(proposal_number).ok_or(Error::<T>::ProposalNotExist)?;;
				proposal_information.apply_status = vote_result;
			}
			Ok(())
		}

	}
}
