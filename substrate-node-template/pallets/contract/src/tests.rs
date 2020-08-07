// Tests to be written here

use crate::{Error, mock::*};
use frame_support::{assert_ok, assert_noop};

#[test]
fn contract_can_add() {
	new_test_ext().execute_with(|| {
		//first
		assert_ok!(TemplateModule::addcontract(
			Origin::signed(1),
			2,
			3u64,
			9997u64,
			1000u64.into(),
			2000,
			true,
			vec![1u8, 2, 3]
		));

		let expected_storage_item = TemplateModule::ContractT {
			ps_addr: 2,
			vpp_number: 3u64,
			block_number: 9997u64,
			contract_price: 1000u64,
			energy_amount: 2000,
			execution_status: 1,
			contract_type: true,
			ammeter_id: vec![1u8, 2, 3],
		};

		assert_eq!(
			TemplateModule::contracts(1, 0).unwrap(),
			expected_storage_item
		);
		assert_eq!(
			TemplateModule::searchcontracts(9997u64),
			(1, 0)
		);
		assert_eq!( TemplateModule::contractcounts(1), 1);

		//second
		assert_ok!(TemplateModule::addcontract(
			Origin::signed(1),
			3,
			4u64,
			8888u64,
			11000u64.into(),
			12000,
			true,
			vec![3u8, 2, 3]
		));

		let expected_storage_item = TemplateModule::ContractT {
			ps_addr: 3,
			vpp_number: 4u64,
			block_number: 8888u64,
			contract_price: 11000u64,
			energy_amount: 12000,
			execution_status: 1,
			contract_type: true,
			ammeter_id: vec![3u8, 2, 3],
		};

		assert_eq!(
			TemplateModule::contracts(1, 1).unwrap(),
			expected_storage_item
		);
		assert_eq!(
			TemplateModule::searchcontracts(8888),
			(1, 1)
		);

		assert_eq!( TemplateModule::contractcounts(1), 2);

	});
}

#[test]
fn contract_can_stop() {
	new_test_ext().execute_with(|| {

		assert_ok!(TemplateModule::addcontract(
			Origin::signed(1),
			2,
			3u64,
			9997u64,
			1000u64.into(),
			2000,
			true,
			vec![1u8, 2, 3]
		));

		let expected_storage_item = TemplateModule::ContractT {
			ps_addr: 2,
			vpp_number: 3u64,
			block_number: 9997u64,
			contract_price: 1000u64,
			energy_amount: 2000,
			execution_status: 1,
			contract_type: true,
			ammeter_id: vec![1u8, 2, 3],
		};

		assert_eq!(
			TemplateModule::contracts(1, 0).unwrap(),
			expected_storage_item
		);

		assert_ok!(TemplateModule::stopcontract());
		let contract = TemplateModule::contracts(1, 0).unwrap();
		assert_eq!(contract.execution_status, 3);
	});
}

#[test]
fn contract_can_complete() {
	new_test_ext().execute_with(|| {
		assert_ok!(TemplateModule::addcontract(
			Origin::signed(1),
			2,
			3u64,
			9997u64,
			1000u64.into(),
			2000,
			true,
			vec![1u8, 2, 3]
		));

		let expected_storage_item = TemplateModule::ContractT {
			ps_addr: 2,
			vpp_number: 3u64,
			block_number: 9997u64,
			contract_price: 1000u64,
			energy_amount: 2000,
			execution_status: 1,
			contract_type: true,
			ammeter_id: vec![1u8, 2, 3],
		};

		assert_eq!(
			TemplateModule::contracts(1, 0).unwrap(),
			expected_storage_item
		);

		assert_ok!(TemplateModule::completecontract());
		let contract = TemplateModule::contracts(1, 0).unwrap();
		assert_eq!(contract.execution_status, 2);

	});
}