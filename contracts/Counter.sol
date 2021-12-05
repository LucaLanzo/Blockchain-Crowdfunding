pragma solidity >=0.4.22;

contract Counter {
    uint public count = 0; // always positive --- default: uint256 --- state var: gets written to BC
    
    // events
    event Increment(uint value);
    event Decrement(uint value);

    // gets called on intialisation/creation of SC and put on the blockchain
    // or count = 0 is fine too
    // constructor() public {
    //    count = 0;
    // }

    // view returns a value
    // or make count variable public
    // function getCount() view public returns(uint) {
    //    return count;
    // }

    // functions can only be called outside of SC with visibility set to public
    function increment() public {
        count += 1;
        // call event --- anyone on blockchain can subscribe to Increment event 
        // and find out value actually went up
        emit Increment(count);
    }
    
    function decrement() public {
        count -= 1;
        // call event
        emit Decrement(count);
    }
}