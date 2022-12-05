// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract Crowdfunding {
    enum ProjectState { RAISING, RAISED, EXPIRED, REFUNDED, PAID }
    
    address payable private creator; // to pay out    
    ProjectState private state;
    uint256 private amountToRaise;
    uint256 private deadline;
    uint256 private startedAt;

    mapping (address => uint) public fundings;

    event NewProjectStarted(string title, string descr, address projectAddress, address creator, uint amountToRaise, uint deadline);
    event NewFunding(address sender, uint amount, uint currentBalance);
    event ProjectPaidOut(address creator, uint256 raisedAmount);


    function viewProject() external view returns(
        address _creator,
        ProjectState _state,
        uint _amountToRaise,
        uint _deadline
    ) {
        _creator = creator;
        _state = state;
        _amountToRaise = amountToRaise;
        _deadline = deadline;
    }


    constructor(string memory _title, string memory _descr, uint _amountToRaise, uint _numberOfDaysUntilDeadline) {
        require(_amountToRaise > 0, "Please set the amount to be raised over 0 wei.");

        creator = payable(msg.sender);
        state = ProjectState.RAISING;
        amountToRaise = _amountToRaise;
        deadline = block.timestamp + (_numberOfDaysUntilDeadline * 1 days);
        startedAt = block.timestamp;

        emit NewProjectStarted(
            _title, 
            _descr,
            address(this),
            msg.sender, 
            _amountToRaise, 
            deadline
        );
    }


    //
    //    Method to contribute to a crowdfunding project
    //    Malpractice checks include state checking, caller checks and also a check which avoids double payment
    // 
    function fund() external payable {
        require(msg.sender != creator, "Project creators can't fund");
        
        checkForExpiration();   
        require(state == ProjectState.RAISING, "The project is no longer raising");

        // fund
        fundings[msg.sender] += msg.value;

        emit NewFunding(msg.sender, msg.value, address(this).balance);

        if(address(this).balance >= amountToRaise) {
            state = ProjectState.RAISED;
        }
    }


    // 
    //    Funding goal met before deadline -> the creator can pay out the balance to himself
    //
    function payOut() external {
       	require(msg.sender == creator, "Only project creator can pay out");
        require(state == ProjectState.RAISED, "Not raised or project expired");      

        // temporary save for emit
        uint _balance = address(this).balance;
        bool transactionSuccessful = creator.send(_balance);

        if (transactionSuccessful) {
            state = ProjectState.PAID;
            emit ProjectPaidOut(creator, _balance);
        } else {
            // revert
            state = ProjectState.RAISED;
        }
    }

    //
    //    Deadline & funding goal not met -> backers can each refund their contributions
    //
    function refund() external {        
        // only funders can pay out (prevents payout to creator as well)
        require(fundings[msg.sender] > 0, "Can't pay out you haven't funded");

        // check if the project has expired
        checkForExpiration();
        require(state == ProjectState.EXPIRED, "The project hasn't expired");

        uint _amountToRefund = fundings[msg.sender];
        fundings[msg.sender] = 0;

        bool transactionSuccessful = payable(msg.sender).send(_amountToRefund);

        if (!transactionSuccessful) {
            // revert
            fundings[msg.sender] = _amountToRefund;
        }

        if (address(this).balance == 0) {
            state = ProjectState.REFUNDED;
        }
    }

    
    //    Checks if project has reached its deadline and amount hasn't been met
    //    @return boolean, true if project ended, false if project still ongoing
    function checkForExpiration() public returns (bool) {
        if (block.timestamp >= deadline && address(this).balance < amountToRaise) {
            state = ProjectState.EXPIRED;
            return true;
        }
        return false;
    }
}
