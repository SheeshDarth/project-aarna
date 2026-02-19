"""
AarnaRegistry — Decentralized MRV for Blue Carbon Ecosystems
Algorand ARC-4 Smart Contract (AlgoPy / Puya)

Project Aarna tracks coastal carbon sequestration projects on-chain.
Developers submit project evidence (IPFS CID), validators review and approve,
and AARNA tokens are issued as carbon credits.

Marketplace: token holders can list credits for sale, buyers pay ALGO.

Status codes:
  0 = none (uninitialised slot)
  1 = pending  — submitted, awaiting review
  2 = verified — validator approved
  3 = rejected — validator rejected
  4 = issued   — carbon credits transferred to submitter
"""

from algopy import (
    ARC4Contract,
    Account,
    Asset,
    UInt64,
    Txn,
    Global,
    itxn,
    arc4,
    subroutine,
    String,
    gtxn,
    log,
)


class AarnaRegistry(ARC4Contract):
    """
    On-chain registry + marketplace for blue carbon credits.

    Lifecycle: SUBMIT → REVIEW → VERIFY / REJECT → ISSUE → TRADE

    Roles:
      - admin: deploys, creates AARNA ASA, assigns validator
      - validator: approves/rejects, issues credits
      - developer: submits projects
      - any holder: lists/buys credits on marketplace
    """

    def __init__(self) -> None:
        # ── Role-based access control ──
        self.admin: Account = Global.zero_address
        self.validator: Account = Global.zero_address

        # ── AARNA token (ASA) ──
        self.aarna_asset: Asset = Asset(0)

        # ── Project bookkeeping ──
        self.project_count: UInt64 = UInt64(0)
        self.total_credits_issued: UInt64 = UInt64(0)

        # ── Flat project storage (4 slots) ──
        self.p0_submitter: Account = Global.zero_address
        self.p0_cid: arc4.String = arc4.String("")
        self.p0_name: arc4.String = arc4.String("")
        self.p0_location: arc4.String = arc4.String("")
        self.p0_ecosystem: arc4.String = arc4.String("")
        self.p0_status: UInt64 = UInt64(0)
        self.p0_credits: UInt64 = UInt64(0)

        self.p1_submitter: Account = Global.zero_address
        self.p1_cid: arc4.String = arc4.String("")
        self.p1_name: arc4.String = arc4.String("")
        self.p1_location: arc4.String = arc4.String("")
        self.p1_ecosystem: arc4.String = arc4.String("")
        self.p1_status: UInt64 = UInt64(0)
        self.p1_credits: UInt64 = UInt64(0)

        self.p2_submitter: Account = Global.zero_address
        self.p2_cid: arc4.String = arc4.String("")
        self.p2_name: arc4.String = arc4.String("")
        self.p2_location: arc4.String = arc4.String("")
        self.p2_ecosystem: arc4.String = arc4.String("")
        self.p2_status: UInt64 = UInt64(0)
        self.p2_credits: UInt64 = UInt64(0)

        self.p3_submitter: Account = Global.zero_address
        self.p3_cid: arc4.String = arc4.String("")
        self.p3_name: arc4.String = arc4.String("")
        self.p3_location: arc4.String = arc4.String("")
        self.p3_ecosystem: arc4.String = arc4.String("")
        self.p3_status: UInt64 = UInt64(0)
        self.p3_credits: UInt64 = UInt64(0)

        # ── Marketplace listing storage (4 slots) ──
        self.listing_count: UInt64 = UInt64(0)

        self.l0_seller: Account = Global.zero_address
        self.l0_amount: UInt64 = UInt64(0)
        self.l0_price: UInt64 = UInt64(0)
        self.l0_active: UInt64 = UInt64(0)

        self.l1_seller: Account = Global.zero_address
        self.l1_amount: UInt64 = UInt64(0)
        self.l1_price: UInt64 = UInt64(0)
        self.l1_active: UInt64 = UInt64(0)

        self.l2_seller: Account = Global.zero_address
        self.l2_amount: UInt64 = UInt64(0)
        self.l2_price: UInt64 = UInt64(0)
        self.l2_active: UInt64 = UInt64(0)

        self.l3_seller: Account = Global.zero_address
        self.l3_amount: UInt64 = UInt64(0)
        self.l3_price: UInt64 = UInt64(0)
        self.l3_active: UInt64 = UInt64(0)

    # ═══════════════════════════════════════════════════
    #  Initialization
    # ═══════════════════════════════════════════════════

    @arc4.abimethod(create="require")
    def init(self) -> None:
        """Deploy the contract and set the caller as admin."""
        self.admin = Txn.sender

    # ═══════════════════════════════════════════════════
    #  Access Control
    # ═══════════════════════════════════════════════════

    @subroutine
    def _only_admin(self) -> None:
        assert Txn.sender == self.admin, "unauthorized: admin only"

    @subroutine
    def _only_validator(self) -> None:
        assert Txn.sender == self.validator, "unauthorized: validator only"

    # ═══════════════════════════════════════════════════
    #  Admin Methods
    # ═══════════════════════════════════════════════════

    @arc4.abimethod
    def set_validator(self, addr: Account) -> None:
        """Admin assigns a validator address for project reviews."""
        self._only_admin()
        self.validator = addr

    @arc4.abimethod
    def transfer_admin(self, new_admin: Account) -> None:
        """Admin transfers ownership to a new admin account."""
        self._only_admin()
        assert new_admin != Global.zero_address, "invalid: zero address"
        self.admin = new_admin

    @arc4.abimethod
    def ensure_token(self) -> arc4.UInt64:
        """
        Create the AARNA ASA if it doesn't exist.
        Returns the ASA ID.
        """
        self._only_admin()
        if not self.aarna_asset:
            result = itxn.AssetConfig(
                total=10_000_000,
                decimals=0,
                default_frozen=False,
                unit_name="AARNA",
                asset_name="Aarna Carbon Credit",
                url="https://aarna.eco",
                manager=Global.current_application_address,
                reserve=Global.current_application_address,
                freeze=Global.current_application_address,
                clawback=Global.current_application_address,
            ).submit()
            self.aarna_asset = result.created_asset
        return arc4.UInt64(self.aarna_asset.id)

    # ═══════════════════════════════════════════════════
    #  Project Submission
    # ═══════════════════════════════════════════════════

    @arc4.abimethod
    def submit_project(
        self,
        name: arc4.String,
        location: arc4.String,
        ecosystem: arc4.String,
        cid: arc4.String,
    ) -> arc4.UInt64:
        """
        Developer submits a new project for review.
        Returns the project index (0-3).
        """
        idx = self.project_count
        assert idx < UInt64(4), "max projects reached (4)"
        sender = Txn.sender

        if idx == UInt64(0):
            self.p0_submitter = sender
            self.p0_name = name
            self.p0_location = location
            self.p0_ecosystem = ecosystem
            self.p0_cid = cid
            self.p0_status = UInt64(1)
            self.p0_credits = UInt64(0)
        elif idx == UInt64(1):
            self.p1_submitter = sender
            self.p1_name = name
            self.p1_location = location
            self.p1_ecosystem = ecosystem
            self.p1_cid = cid
            self.p1_status = UInt64(1)
            self.p1_credits = UInt64(0)
        elif idx == UInt64(2):
            self.p2_submitter = sender
            self.p2_name = name
            self.p2_location = location
            self.p2_ecosystem = ecosystem
            self.p2_cid = cid
            self.p2_status = UInt64(1)
            self.p2_credits = UInt64(0)
        else:
            self.p3_submitter = sender
            self.p3_name = name
            self.p3_location = location
            self.p3_ecosystem = ecosystem
            self.p3_cid = cid
            self.p3_status = UInt64(1)
            self.p3_credits = UInt64(0)

        self.project_count = idx + UInt64(1)
        return arc4.UInt64(idx)

    # ═══════════════════════════════════════════════════
    #  Validator Methods
    # ═══════════════════════════════════════════════════

    @arc4.abimethod
    def approve_project(self, project_id: UInt64, credits: UInt64) -> None:
        """Validator approves a project and assigns credit amount."""
        self._only_validator()
        assert project_id < self.project_count, "invalid project id"
        assert credits > UInt64(0), "credits must be > 0"

        if project_id == UInt64(0):
            assert self.p0_status == UInt64(1), "project not pending"
            self.p0_status = UInt64(2)
            self.p0_credits = credits
        elif project_id == UInt64(1):
            assert self.p1_status == UInt64(1), "project not pending"
            self.p1_status = UInt64(2)
            self.p1_credits = credits
        elif project_id == UInt64(2):
            assert self.p2_status == UInt64(1), "project not pending"
            self.p2_status = UInt64(2)
            self.p2_credits = credits
        else:
            assert self.p3_status == UInt64(1), "project not pending"
            self.p3_status = UInt64(2)
            self.p3_credits = credits

    @arc4.abimethod
    def reject_project(self, project_id: UInt64) -> None:
        """Validator rejects a pending project."""
        self._only_validator()
        assert project_id < self.project_count, "invalid project id"

        if project_id == UInt64(0):
            assert self.p0_status == UInt64(1), "project not pending"
            self.p0_status = UInt64(3)
        elif project_id == UInt64(1):
            assert self.p1_status == UInt64(1), "project not pending"
            self.p1_status = UInt64(3)
        elif project_id == UInt64(2):
            assert self.p2_status == UInt64(1), "project not pending"
            self.p2_status = UInt64(3)
        else:
            assert self.p3_status == UInt64(1), "project not pending"
            self.p3_status = UInt64(3)

    @arc4.abimethod
    def issue_credits(self, project_id: UInt64) -> arc4.UInt64:
        """
        Validator issues AARNA tokens to submitter.
        Status: 2 (verified) → 4 (issued). Prevents double-issuance.
        """
        self._only_validator()
        assert self.aarna_asset, "no AARNA token created"
        assert project_id < self.project_count, "invalid project id"

        if project_id == UInt64(0):
            assert self.p0_status == UInt64(2), "project not verified"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.p0_submitter,
                asset_amount=self.p0_credits,
            ).submit()
            self.p0_status = UInt64(4)
            self.total_credits_issued = self.total_credits_issued + self.p0_credits
            return arc4.UInt64(self.p0_credits)
        elif project_id == UInt64(1):
            assert self.p1_status == UInt64(2), "project not verified"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.p1_submitter,
                asset_amount=self.p1_credits,
            ).submit()
            self.p1_status = UInt64(4)
            self.total_credits_issued = self.total_credits_issued + self.p1_credits
            return arc4.UInt64(self.p1_credits)
        elif project_id == UInt64(2):
            assert self.p2_status == UInt64(2), "project not verified"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.p2_submitter,
                asset_amount=self.p2_credits,
            ).submit()
            self.p2_status = UInt64(4)
            self.total_credits_issued = self.total_credits_issued + self.p2_credits
            return arc4.UInt64(self.p2_credits)
        else:
            assert self.p3_status == UInt64(2), "project not verified"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.p3_submitter,
                asset_amount=self.p3_credits,
            ).submit()
            self.p3_status = UInt64(4)
            self.total_credits_issued = self.total_credits_issued + self.p3_credits
            return arc4.UInt64(self.p3_credits)

    # ═══════════════════════════════════════════════════
    #  Marketplace
    # ═══════════════════════════════════════════════════

    @arc4.abimethod
    def list_for_sale(self, amount: UInt64, price_per_token: UInt64) -> arc4.UInt64:
        """
        List AARNA tokens for sale. Uses clawback to escrow tokens
        from seller into the contract. Returns the listing index.

        Args:
            amount: number of AARNA tokens to sell
            price_per_token: price per token in microALGO
        """
        assert self.aarna_asset, "no AARNA token"
        assert amount > UInt64(0), "amount must be > 0"
        assert price_per_token > UInt64(0), "price must be > 0"

        idx = self.listing_count
        assert idx < UInt64(4), "max listings reached (4)"

        # Clawback tokens from seller into contract escrow
        itxn.AssetTransfer(
            xfer_asset=self.aarna_asset,
            asset_sender=Txn.sender,
            asset_receiver=Global.current_application_address,
            asset_amount=amount,
        ).submit()

        seller = Txn.sender

        if idx == UInt64(0):
            self.l0_seller = seller
            self.l0_amount = amount
            self.l0_price = price_per_token
            self.l0_active = UInt64(1)
        elif idx == UInt64(1):
            self.l1_seller = seller
            self.l1_amount = amount
            self.l1_price = price_per_token
            self.l1_active = UInt64(1)
        elif idx == UInt64(2):
            self.l2_seller = seller
            self.l2_amount = amount
            self.l2_price = price_per_token
            self.l2_active = UInt64(1)
        else:
            self.l3_seller = seller
            self.l3_amount = amount
            self.l3_price = price_per_token
            self.l3_active = UInt64(1)

        self.listing_count = idx + UInt64(1)
        return arc4.UInt64(idx)

    @arc4.abimethod
    def buy_listing(self, listing_id: UInt64, payment: gtxn.PaymentTransaction) -> None:
        """
        Buy tokens from a listing. Buyer sends ALGO payment,
        contract transfers escrowed tokens to buyer and forwards ALGO to seller.
        """
        assert self.aarna_asset, "no AARNA token"
        assert listing_id < self.listing_count, "invalid listing id"

        if listing_id == UInt64(0):
            assert self.l0_active == UInt64(1), "listing not active"
            total_cost = self.l0_amount * self.l0_price
            assert payment.amount >= total_cost, "insufficient payment"
            assert payment.receiver == Global.current_application_address, "pay the contract"
            # Transfer tokens to buyer
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=Txn.sender,
                asset_amount=self.l0_amount,
            ).submit()
            # Forward ALGO to seller
            itxn.Payment(
                receiver=self.l0_seller,
                amount=total_cost,
            ).submit()
            self.l0_active = UInt64(0)
        elif listing_id == UInt64(1):
            assert self.l1_active == UInt64(1), "listing not active"
            total_cost = self.l1_amount * self.l1_price
            assert payment.amount >= total_cost, "insufficient payment"
            assert payment.receiver == Global.current_application_address, "pay the contract"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=Txn.sender,
                asset_amount=self.l1_amount,
            ).submit()
            itxn.Payment(
                receiver=self.l1_seller,
                amount=total_cost,
            ).submit()
            self.l1_active = UInt64(0)
        elif listing_id == UInt64(2):
            assert self.l2_active == UInt64(1), "listing not active"
            total_cost = self.l2_amount * self.l2_price
            assert payment.amount >= total_cost, "insufficient payment"
            assert payment.receiver == Global.current_application_address, "pay the contract"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=Txn.sender,
                asset_amount=self.l2_amount,
            ).submit()
            itxn.Payment(
                receiver=self.l2_seller,
                amount=total_cost,
            ).submit()
            self.l2_active = UInt64(0)
        else:
            assert self.l3_active == UInt64(1), "listing not active"
            total_cost = self.l3_amount * self.l3_price
            assert payment.amount >= total_cost, "insufficient payment"
            assert payment.receiver == Global.current_application_address, "pay the contract"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=Txn.sender,
                asset_amount=self.l3_amount,
            ).submit()
            itxn.Payment(
                receiver=self.l3_seller,
                amount=total_cost,
            ).submit()
            self.l3_active = UInt64(0)

    @arc4.abimethod
    def cancel_listing(self, listing_id: UInt64) -> None:
        """Seller cancels their listing. Escrowed tokens returned."""
        assert listing_id < self.listing_count, "invalid listing id"

        if listing_id == UInt64(0):
            assert self.l0_active == UInt64(1), "listing not active"
            assert Txn.sender == self.l0_seller, "only seller can cancel"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.l0_seller,
                asset_amount=self.l0_amount,
            ).submit()
            self.l0_active = UInt64(0)
        elif listing_id == UInt64(1):
            assert self.l1_active == UInt64(1), "listing not active"
            assert Txn.sender == self.l1_seller, "only seller can cancel"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.l1_seller,
                asset_amount=self.l1_amount,
            ).submit()
            self.l1_active = UInt64(0)
        elif listing_id == UInt64(2):
            assert self.l2_active == UInt64(1), "listing not active"
            assert Txn.sender == self.l2_seller, "only seller can cancel"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.l2_seller,
                asset_amount=self.l2_amount,
            ).submit()
            self.l2_active = UInt64(0)
        else:
            assert self.l3_active == UInt64(1), "listing not active"
            assert Txn.sender == self.l3_seller, "only seller can cancel"
            itxn.AssetTransfer(
                xfer_asset=self.aarna_asset,
                asset_receiver=self.l3_seller,
                asset_amount=self.l3_amount,
            ).submit()
            self.l3_active = UInt64(0)

    # ═══════════════════════════════════════════════════
    #  Read-Only Getters
    # ═══════════════════════════════════════════════════

    @arc4.abimethod(readonly=True)
    def get_project_count(self) -> arc4.UInt64:
        return arc4.UInt64(self.project_count)

    @arc4.abimethod(readonly=True)
    def get_asset_id(self) -> arc4.UInt64:
        return arc4.UInt64(self.aarna_asset.id)

    @arc4.abimethod(readonly=True)
    def get_admin(self) -> Account:
        return self.admin

    @arc4.abimethod(readonly=True)
    def get_validator(self) -> Account:
        return self.validator

    @arc4.abimethod(readonly=True)
    def get_total_credits_issued(self) -> arc4.UInt64:
        return arc4.UInt64(self.total_credits_issued)

    @arc4.abimethod(readonly=True)
    def get_project_status(self, project_id: UInt64) -> arc4.UInt64:
        if project_id == UInt64(0):
            return arc4.UInt64(self.p0_status)
        elif project_id == UInt64(1):
            return arc4.UInt64(self.p1_status)
        elif project_id == UInt64(2):
            return arc4.UInt64(self.p2_status)
        else:
            return arc4.UInt64(self.p3_status)

    @arc4.abimethod(readonly=True)
    def get_project_cid(self, project_id: UInt64) -> arc4.String:
        if project_id == UInt64(0):
            return self.p0_cid
        elif project_id == UInt64(1):
            return self.p1_cid
        elif project_id == UInt64(2):
            return self.p2_cid
        else:
            return self.p3_cid

    @arc4.abimethod(readonly=True)
    def get_project_name(self, project_id: UInt64) -> arc4.String:
        if project_id == UInt64(0):
            return self.p0_name
        elif project_id == UInt64(1):
            return self.p1_name
        elif project_id == UInt64(2):
            return self.p2_name
        else:
            return self.p3_name

    @arc4.abimethod(readonly=True)
    def get_project_location(self, project_id: UInt64) -> arc4.String:
        if project_id == UInt64(0):
            return self.p0_location
        elif project_id == UInt64(1):
            return self.p1_location
        elif project_id == UInt64(2):
            return self.p2_location
        else:
            return self.p3_location

    @arc4.abimethod(readonly=True)
    def get_project_credits(self, project_id: UInt64) -> arc4.UInt64:
        if project_id == UInt64(0):
            return arc4.UInt64(self.p0_credits)
        elif project_id == UInt64(1):
            return arc4.UInt64(self.p1_credits)
        elif project_id == UInt64(2):
            return arc4.UInt64(self.p2_credits)
        else:
            return arc4.UInt64(self.p3_credits)

    @arc4.abimethod(readonly=True)
    def get_project_submitter(self, project_id: UInt64) -> Account:
        if project_id == UInt64(0):
            return self.p0_submitter
        elif project_id == UInt64(1):
            return self.p1_submitter
        elif project_id == UInt64(2):
            return self.p2_submitter
        else:
            return self.p3_submitter

    @arc4.abimethod(readonly=True)
    def get_project_ecosystem(self, project_id: UInt64) -> arc4.String:
        if project_id == UInt64(0):
            return self.p0_ecosystem
        elif project_id == UInt64(1):
            return self.p1_ecosystem
        elif project_id == UInt64(2):
            return self.p2_ecosystem
        else:
            return self.p3_ecosystem

    # ── Marketplace Getters ──

    @arc4.abimethod(readonly=True)
    def get_listing_count(self) -> arc4.UInt64:
        return arc4.UInt64(self.listing_count)

    @arc4.abimethod(readonly=True)
    def get_listing_seller(self, listing_id: UInt64) -> Account:
        if listing_id == UInt64(0):
            return self.l0_seller
        elif listing_id == UInt64(1):
            return self.l1_seller
        elif listing_id == UInt64(2):
            return self.l2_seller
        else:
            return self.l3_seller

    @arc4.abimethod(readonly=True)
    def get_listing_amount(self, listing_id: UInt64) -> arc4.UInt64:
        if listing_id == UInt64(0):
            return arc4.UInt64(self.l0_amount)
        elif listing_id == UInt64(1):
            return arc4.UInt64(self.l1_amount)
        elif listing_id == UInt64(2):
            return arc4.UInt64(self.l2_amount)
        else:
            return arc4.UInt64(self.l3_amount)

    @arc4.abimethod(readonly=True)
    def get_listing_price(self, listing_id: UInt64) -> arc4.UInt64:
        if listing_id == UInt64(0):
            return arc4.UInt64(self.l0_price)
        elif listing_id == UInt64(1):
            return arc4.UInt64(self.l1_price)
        elif listing_id == UInt64(2):
            return arc4.UInt64(self.l2_price)
        else:
            return arc4.UInt64(self.l3_price)

    @arc4.abimethod(readonly=True)
    def get_listing_active(self, listing_id: UInt64) -> arc4.UInt64:
        if listing_id == UInt64(0):
            return arc4.UInt64(self.l0_active)
        elif listing_id == UInt64(1):
            return arc4.UInt64(self.l1_active)
        elif listing_id == UInt64(2):
            return arc4.UInt64(self.l2_active)
        else:
            return arc4.UInt64(self.l3_active)
