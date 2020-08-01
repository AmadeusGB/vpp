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
    fn do_apply(owner: AccountId, apply_role: u8) -> dispatch::DispatchResult;
}

pub trait TypeTransfer<AccountId> {
    fn staketransfer(who: &AccountId, energy_token: u64) -> dispatch::DispatchResult;
    fn do_buytransfer(vpp_addr: AccountId, vpp_number: u64, payment_addr: AccountId, payment_token: u32) -> dispatch::DispatchResult;
}

pub trait Parliament<AccountId> {
    fn is_member(who: &AccountId) -> bool;
}

pub trait Token<AccountId> {
    fn do_transfertoken(from: AccountId, to: AccountId, token_amount: u32) -> dispatch::DispatchResult;
    fn do_incentivetoken(sender: AccountId, incentive_status: bool, incentive_token: u32) -> dispatch::DispatchResult;
    fn do_staketoken(sender: AccountId,stake_token:u32) -> dispatch::DispatchResult;
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
