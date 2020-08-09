// Tests to be written here

use crate::{Error, mock::*};
use frame_support::{assert_ok, assert_noop};

#[test]
fn identity_can_apply() {
  new_test_ext().execute_with(|| {
    assert_ok!(RoleModule::apply(Origin::signed(1), 0));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pu, true);

    assert_ok!(RoleModule::apply(Origin::signed(1), 1));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pg, true);

    assert_ok!(RoleModule::apply(Origin::signed(1), 2));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.ps, true);

    assert_ok!(RoleModule::apply(Origin::signed(1), 3));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.sg, true);

    assert_ok!(RoleModule::apply(Origin::signed(1), 4));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.ass, true);

    assert_ok!(RoleModule::apply(Origin::signed(1), 5));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pom, true);

    assert_ok!(RoleModule::apply(Origin::signed(1), 7));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pom, false);
  });
}

#[test]
fn identity_can_logout() {
  new_test_ext().execute_with(|| {
    assert_ok!(RoleModule::logout(Origin::signed(1), 0));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pu, false);

    assert_ok!(RoleModule::logout(Origin::signed(1), 1));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pg, false);

    assert_ok!(RoleModule::logout(Origin::signed(1), 2));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.ps, false);

    assert_ok!(RoleModule::logout(Origin::signed(1), 3));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.sg, false);

    assert_ok!(RoleModule::logout(Origin::signed(1), 4));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.ass, false);

    assert_ok!(RoleModule::logout(Origin::signed(1), 5));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pom, false);

    assert_ok!(RoleModule::logout(Origin::signed(1), 7));
    let ps_role = RoleModule::roles(1).unwrap();
    assert_eq!(ps_role.pom, false);
  });
}