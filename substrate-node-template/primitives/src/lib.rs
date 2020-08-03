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
    fn staketransfer(who: &AccountId, energy_token: u32) -> dispatch::DispatchResult;
    fn do_buytransfer(vpp_addr: AccountId, vpp_number: u64, payment_addr: AccountId, payment_token: u32) -> dispatch::DispatchResult;
    fn do_selltransfer(ps_addr: AccountId, vpp_number: u64, payment_addr: AccountId, payment_token: u32) -> dispatch::DispatchResult;
}

pub trait Parliament<AccountId> {
    fn is_member(who: &AccountId) -> bool;
}

pub trait Token<AccountId> {
    fn do_transfertoken(from: AccountId, to: AccountId, token_amount: u32) -> dispatch::DispatchResult;
    fn do_incentivetoken(sender: AccountId, incentive_status: bool, incentive_token: u32) -> dispatch::DispatchResult;
    fn do_staketoken(sender: AccountId,stake_token:u32) -> dispatch::DispatchResult;
    fn do_votetoken(sender: AccountId,vote_token:u32) -> dispatch::DispatchResult;
}

pub trait Contract<AccountId> {
    fn do_addcontract(
                    sender: AccountId,		
                    ps_addr: AccountId,									        //签订该合同的PS地址(通过地址和ID取得VPP所有信息)
                    vpp_number: u64,											//该地址下虚拟电厂ID
                    contract_price: u32,		  			                     //合同总价
                    energy_amount: u64,							  			 //购买/出售电能度数
                    contract_type:bool,								 			//合同分类（购买/出售）
                    energy_type: u8,											  //能源类型（0：光电，1：风电，2：火电）
                    ammeter_id: Vec<u8> 									//电表编号
    ) -> dispatch::DispatchResult;
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
