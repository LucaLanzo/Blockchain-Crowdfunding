// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.11;


contract Crowdfunding {
    Project[] private allProjects;


    /**
        description
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
        description
    */
    function createNewProject(string calldata _title, string calldata _descr, uint _amountToRaise, uint _numberOfDaysUntilDeadline) external {
        uint deadline = block.timestamp + (_numberOfDaysUntilDeadline * 1 days);

        require(block.timestamp < deadline);
        require(_amountToRaise > 0);

        Project project = new Project(_title, _descr, _amountToRaise, deadline, payable(msg.sender));
        allProjects.push(project);

        emit NewProjectStarted(
            _title, 
            _descr,
            address(project),
            msg.sender, 
            _amountToRaise, 
            deadline);
    }

    /** 
        only necessary when visibility = private
    */
    function viewAllProjects() external view returns(Project[] memory) {
        return allProjects;
    }
}


contract Project {
    enum ProjectState { RAISING, RAISED, EXPIRED, REFUNDED }
    
    string title;
    string descr;
    
    address payable creator; // to pay out
    
    ProjectState state;
    uint amountToRaise;
    uint256 currentBalance;
    uint deadline;

    uint completedAt;
    uint256 balanceAtCompletion;

    mapping (address => uint) public fundings;

    /**
        description
    */
    event NewFunding(address sender, uint amount, uint currentBalance);

    /**
    
    */
    event ProjectRaised(address creator, uint256 currentBalance);

    modifier inProjectState(ProjectState _state) {
        require(state == _state);
        _;
    }

    modifier inProjectStateMultiple(ProjectState _state, ProjectState _state2) {
        require(state == _state || state == _state2);
        _;
    }

    constructor(string memory _title, string memory _descr, uint _amountToRaise, uint _deadline, address payable _creator) {
        title = _title;
        descr = _descr;
        amountToRaise = _amountToRaise;
        currentBalance = 0;
        deadline = _deadline;
        state = ProjectState.RAISING;
        creator = _creator;
    }


    /** 
        description
        The first line is very important. Imagine if the project is close to finish and the goal hasn't been quite met yet, the creator could
        just send the remaining amount and close the project himself. This is like artificially inflating the raised amount which is no bueno.
    */
    function fund() external inProjectState(ProjectState.RAISING) payable {
        // Can't fund when the time is over
        require(checkProjectEnded() != true);

        require(msg.sender != creator);

        fundings[msg.sender] = msg.value;

        currentBalance += msg.value;

        emit NewFunding(msg.sender, msg.value, currentBalance);

        checkProjectEnded();
    }


    /**

    */
    function checkProjectEnded() public returns (bool) {
        bool amountMet = currentBalance >= amountToRaise;
        bool timeOver = block.timestamp >= deadline;
        
        // TODO: When project is over, expireProject

        if (amountMet) {
            state = ProjectState.RAISED;
            payOut();
            
            return true;
        } else if (timeOver) {
            state = ProjectState.EXPIRED;
            
            trackCompletion();
            
            return true;
        } else {
            return false;
        }   
    }


    /** 
        description
    */
    function payOut() internal inProjectState(ProjectState.RAISED) returns (bool) {
       	uint256 _currentBalance = currentBalance;
        currentBalance = 0;

        bool transactionSuccessful = creator.send(_currentBalance);

        if (transactionSuccessful) {
            emit ProjectRaised(creator, _currentBalance);

            trackCompletion(_currentBalance);

            return true;
        } else {
            // revert
            currentBalance = _currentBalance;
            state = ProjectState.RAISED;

            trackCompletion();

            return false;
        }
    }


    /**
    
    */
    function trackCompletion() internal inProjectStateMultiple(ProjectState.RAISED, ProjectState.EXPIRED) {
        // Check is important so that the time doesn't get updated twice
        if (completedAt == 0) {     
            balanceAtCompletion = currentBalance;
            completedAt = block.timestamp;
        }
    }


    /**
    
    */
    function trackCompletion(uint256 balance) internal inProjectStateMultiple(ProjectState.RAISED, ProjectState.EXPIRED) {
        // Check is important so that the time doesn't get updated twice
        if (completedAt == 0) {     
            balanceAtCompletion = balance;
            completedAt = block.timestamp;
        }
    }


    /** 
        description
    */
    function refund() public inProjectState(ProjectState.EXPIRED) returns (bool) {
        // check if sender has even funded the project
        require(fundings[msg.sender] > 0);

        uint _amountToRefund = fundings[msg.sender];
        fundings[msg.sender] = 0;

        bool transactionSuccessful = payable(msg.sender).send(_amountToRefund);

        if (transactionSuccessful) {
            currentBalance -= _amountToRefund;
        } else {
            // revert
            fundings[msg.sender] = _amountToRefund;
            return false;
        }
        return true;
    }


    /**
        get total contributions view
    */
    function viewTotalContributions() view public returns(uint256 _currentBalance) {
        _currentBalance = currentBalance;
    }


    /**
    
    */
    function viewProject() external view returns(
        string memory _title,
        string memory _descr,
        address _creator,
        ProjectState _state,
        uint _amountToRaise,
        uint256 _currentBalance,
        uint _deadline,
        uint _completedAt,
        uint256 _balanceAtCompletion 
    ) {
        _title = title;
        _descr = descr;
        _creator = creator;
        _state = state;
        _amountToRaise = amountToRaise;
        _currentBalance = currentBalance;
        _deadline = deadline;
        _completedAt = completedAt;
        _balanceAtCompletion = balanceAtCompletion;
    }
}
