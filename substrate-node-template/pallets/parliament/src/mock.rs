// Creating mock runtime here

use crate::{Module, Trait};
use sp_core::H256;
use frame_support::{impl_outer_origin, parameter_types, weights::Weight};
use sp_runtime::{
	traits::{BlakeTwo256, IdentityLookup}, testing::Header, Perbill,
};
use frame_system as system;
use primitives::{Vpp};

impl_outer_origin! {
	pub enum Origin for Test {}
}

// For testing the pallet, we construct most of a mock runtime. This means
// first constructing a configuration type (`Test`) which `impl`s each of the
// configuration traits of pallets we want to use.
#[derive(Clone, Eq, PartialEq)]
pub struct Test;
parameter_types! {
	pub const BlockHashCount: u64 = 250;
	pub const MaximumBlockWeight: Weight = 1024;
	pub const MaximumBlockLength: u32 = 2 * 1024;
	pub const AvailableBlockRatio: Perbill = Perbill::from_percent(75);
}
impl system::Trait for Test {
	type Origin = Origin;
	type Call = ();
	type Index = u64;
	type BlockNumber = u64;
	type Hash = H256;
	type Hashing = BlakeTwo256;
	type AccountId = u64;
	type Lookup = IdentityLookup<Self::AccountId>;
	type Header = Header;
	type Event = ();
	type BlockHashCount = BlockHashCount;
	type MaximumBlockWeight = MaximumBlockWeight;
	type DbWeight = ();
	type BlockExecutionWeight = ();
	type ExtrinsicBaseWeight = ();
	type MaximumExtrinsicWeight = MaximumBlockWeight;
	type MaximumBlockLength = MaximumBlockLength;
	type AvailableBlockRatio = AvailableBlockRatio;
	type Version = ();
	type ModuleToIndex = ();
	type AccountData = ();
	type OnNewAccount = ();
	type OnKilledAccount = ();
}

parameter_types! {
	pub const MaxMemberCount: usize = 10;
}
impl Trait for Test {
	type Event = ();
	type MaxMemberCount = MaxMemberCount;
}

impl identity::Trait for Test {
	type Event = Event;
	type Currency = Balances;
}

impl audit::Trait for Test {
	type Event = Event;
	type Currency = Balances;
}

impl contract::Trait for Test {
	type Event = Event;
	type Vpp = trade::Module<Test>;
	type Currency = Balances;
}

impl token::Trait for Test {
	type Event = Event;
	type Currency = Balances;
}

impl trade::Trait for Test {
	type Event = Event;
	type Currency = Balances;
	type Role = identity::Module<Test>;
	type TypeTransfer = typetransfer::Module<Test>;
	type Contract = contract::Module<Test>;
}

impl parliament::Trait for Test {
	type Event = Event;
	type Vpp = trade::Module<Test>;
	type MaxMemberCount = MaxMemberCount;
}

impl typetransfer::Trait for Test {
	type Event = Event;
	type Currency = Balances;
	type Token = token::Module<Test>;
	type MinDustCheckBalance = MinDustCheckBalance;
	type MinDustCheckSeconds = MinDustCheckSeconds;
}

parameter_types! {
	pub const MaxClaimLength: u32 = 6;
	pub const MinDustCheckBalance:u32 = 100;
	pub const MinDustCheckSeconds:u32 = 5;
}

pub type TemplateModule = Module<Test>;

// This function basically just builds a genesis storage key/value store according to
// our desired mockup.
pub fn new_test_ext() -> sp_io::TestExternalities {
	system::GenesisConfig::default().build_storage::<Test>().unwrap().into()
}
