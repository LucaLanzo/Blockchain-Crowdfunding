// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.11;

/** @title Blockfunding crowdfunding
    @notice A smart contract for development purposes, ready to be used in a crowdfunding application using the Ethereum blockchain
*/
contract Crowdfunding {
    Project[] private allProjects;


    /**
        Event triggered for new projects that have been started
    */
    event NewProjectStarted(
        string title, 
        string descr,
        address projectAddress,
        address creator,
        uint amountToRaise,
        uint deadline
    );

    /** 
        Starts a new project, does some checks to prevent bad input, pushes it to a list and emits an event
        @param title, description, funding goal, deadline in full days
        @return none
    */
    function createNewProject(string calldata _title, string calldata _descr, uint _amountToRaise, uint _numberOfDaysUntilDeadline) external {
        uint deadline = block.timestamp + (_numberOfDaysUntilDeadline * 1 days);

        require(block.timestamp < deadline, "Please choose a time in the future.");
        require(_amountToRaise > 0, "Please set the amount to be raised over 0 wei.");

        Project project = new Project(_title, _descr, _amountToRaise, deadline, payable(msg.sender), block.timestamp);
        allProjects.push(project);

        emit NewProjectStarted(
            _title, 
            _descr,
            address(project),
            msg.sender, 
            _amountToRaise, 
            deadline
        );
    }

    /** 
        Returns all started projects as a list of addresses
        @param none
        @return list of project addresses
        @notice does not return the contracts but only string literals/addresses
    */
    function viewAllProjects() external view returns(Project[] memory) {
        return allProjects;
    }
}


contract Project {
    enum ProjectState { RAISING, RAISED, EXPIRED, REFUNDED, PAYOUT }
    
    string title;
    string descr;
    
    address payable creator; // to pay out
    
    ProjectState state;
    uint amountToRaise;
    uint256 currentBalance;
    uint deadline;
    uint startedAt;

    address public projectAddress;

    // for logging once project finished
    uint completedAt;
    uint256 completedBalance;


    mapping (address => uint) public fundings;

    /**
        Event triggered for new fundings
    */
    event NewFunding(address sender, uint amount, uint currentBalance);

    /**
        Event triggered when a crowdfunding was successful and the balance has been paid to the creator
    */
    event ProjectPaidOut(address creator, uint256 currentBalance);

    constructor(string memory _title, string memory _descr, uint _amountToRaise, uint _deadline, address payable _creator, uint _startedAt) {
        title = _title;
        descr = _descr;
        amountToRaise = _amountToRaise;
        currentBalance = 0;
        deadline = _deadline;
        state = ProjectState.RAISING;
        creator = _creator;
        startedAt = _startedAt;
        projectAddress = address(this);
    }

    /**
        Method to contribute to a crowdfunding project. Takes several measures to avoid malpractice. 
        Checks include state checking, caller checks and also a check which avoids double payment
        @param none
        @return none
    */
    function fund() external payable {
        require(msg.sender != creator, "The project creator can not fund the project.");
        
        // check if projectEnded. This check at the start prevents that another funding happens after the project goal or deadline is met
        require(state == ProjectState.RAISING, "The project is not raising capital at the moment anymore. Use checkIfProjectEnded to end the project.");
        // same as the one above, just in case. Require reverts everything so the end is not tracked
        require(checkIfProjectEnded() != true, "The project is not raising capital at the moment anymore. Use checkIfProjectEnded to end the project.");

        // fund
        fundings[msg.sender] += msg.value;

        currentBalance += msg.value;

        emit NewFunding(msg.sender, msg.value, currentBalance);

        checkIfProjectEnded();
    }

    /**
        Once a crowdfunding goal has been met, the creator can pay himself the balance
        @param None
        @return None, only an event is emitted
    */
    function payOut() external {
       	require(msg.sender == creator, "Only the creator of the project can pay out the raised amount once the funding goal has been met.");

        // check if projectEnded, already payed out or not in State RAISED
        require(checkIfProjectEnded() == true, "The goal hasn't been raised yet. Please wait longer and check for the end using checkIfProjectEnded.");
        require(state != ProjectState.PAYOUT, "The amount was already payed out to you. Congratulations!");
        require(state == ProjectState.RAISED, "The goal hasn't been raised yet. Please wait longer and check for the end using checkIfProjectEnded.");      

        uint256 _currentBalance = currentBalance;
        currentBalance = 0;

        bool transactionSuccessful = creator.send(_currentBalance);

        if (transactionSuccessful) {
            state = ProjectState.PAYOUT;
            emit ProjectPaidOut(creator, _currentBalance);
        } else {
            // revert
            currentBalance = _currentBalance;
            state = ProjectState.RAISED;
        }
    }

    /**
        Once a project reaches it's deadline and the funding goal hasn't been met, the backers can each refund their contributions
        @param None
        @return Only money :)
    */
    function refund() external {        
        // shouldn't be possible anyway as the creator can not fund the project in the first place, but should revert with a good error message
        require(msg.sender != creator, "Only the backers of the project can refund their raised amount if the goal hasn't been met."); 

        // check if the method caller has even funded the project
        require(fundings[msg.sender] > 0, "Can't refund any amount as you haven't funded the project.");

        // check if projectEnded and the deadline was passed
        require(checkIfProjectEnded() == true, "The project hasn't expired. Please fund or wait longer and check for the end using checkIfProjectEnded.");
        require(state == ProjectState.EXPIRED, "The project hasn't expired. Please fund or wait longer and check for the end using checkIfProjectEnded.");

        uint _amountToRefund = fundings[msg.sender];
        fundings[msg.sender] = 0;

        bool transactionSuccessful = payable(msg.sender).send(_amountToRefund);

        if (transactionSuccessful) {
            currentBalance -= _amountToRefund;
        } else {
            // revert
            fundings[msg.sender] = _amountToRefund;
        }

        if (currentBalance == 0) {
            state = ProjectState.REFUNDED;
        }
    }

    /**
        Helper function, to check whether a project is funded or has reached its deadline. Will also track the time when the project has been completed
        @param None
        @return boolean, true for project end, false for still ongoing
        @dev this method is mostly called from inside the other functions. In the frontend, the view at the bottom (which returns the projects data) is used
        to display the project's state
    */
    function checkIfProjectEnded() public returns (bool) {
        bool amountMet = currentBalance >= amountToRaise;
        bool timeOver = block.timestamp >= deadline;
        
        if (amountMet) {
            state = ProjectState.RAISED;

            trackCompletion();

            return true;
        } else if (timeOver) {
            state = ProjectState.EXPIRED;

            trackCompletion();

            return true;
        } else if (state == ProjectState.PAYOUT) {
            return true;
        } else {
            return false;
        }   
    }

    /**
        Tracks the time and last amount once a project is funded or expired
    */
    function trackCompletion() internal {
        // if the time hasn't been set before, then track it now else just leave the time which has been set already
        // this prevents double entries if checkIfProjectEnded is called multiple times
        if (completedAt == 0) {
            // only track the times & amount if the project has been completed in time
            if (block.timestamp <= deadline) {
                completedAt = block.timestamp;
                completedAt = block.timestamp;
                completedBalance = currentBalance;
            }
        }
    }

    /**
        get total contributions view
    */
    function viewTotalContributions() external view returns(uint256 _currentBalance) {
        // if the project has been finished and has been payed out, the balance will be 0. 
        // in this case, return the logged balance
        if (state == ProjectState.RAISED || state == ProjectState.EXPIRED) {
            _currentBalance = completedBalance;
        } else {
            _currentBalance = currentBalance;
        }
    }


    /**
        A view which returns all the information about a project
    */
    function viewProject() external view returns(
        string memory _title,
        string memory _descr,
        address _creator,
        ProjectState _state,
        uint _amountToRaise,
        uint256 _currentBalance,
        uint _deadline,
        uint _startedAt,
        uint _completedAt,
        uint256 _completedBalance,
        address _projectAddress
    ) {
        _title = title;
        _descr = descr;
        _creator = creator;
        _state = state;
        _amountToRaise = amountToRaise;
        _currentBalance = currentBalance;
        _deadline = deadline;
        _startedAt = startedAt;
        _completedAt = completedAt;
        _completedBalance = completedBalance;
        _projectAddress = projectAddress;
    }
}
