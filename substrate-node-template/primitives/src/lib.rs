#![cfg_attr(not(feature = "std"), no_std)]

use sp_std::prelude::*;
use frame_support::dispatch;
use codec::{Encode, Decode};
use sp_runtime::RuntimeDebug;

pub type Balance = u128;

pub trait Vpp<AccountId> {
    fn update_status(vpp: &AccountId, vpp_number: u64, approval_status: ApprovalStatus) -> dispatch::DispatchResult;
    fn buy(who: &AccountId, vpp: &AccountId, vpp_number: u64, price: Balance, energy_amount: u64) -> dispatch::DispatchResult;
    fn vpp_exists(who: &AccountId, vpp_number: u64) -> bool;
}

pub trait Role<AccountId> {
    fn has_role(who: &AccountId, apply_role: u8) -> bool;
}

#[derive(Encode, Decode, PartialEq, Eq, Clone, Copy, RuntimeDebug)]
pub enum ApprovalStatus {
    Denied,
    Passed,
    Pending,
}

#[derive(Encode, Decode, PartialEq, Eq, Clone, Copy, RuntimeDebug)]
pub enum BusinessStatus {
    Opened,
    Closed,
}
