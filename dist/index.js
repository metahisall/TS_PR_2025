"use strict";
function thisIsAEleven(n) {
    let result = false;
    if (n === 11 || n === "11" || n.toString().toLocaleLowerCase() === "eleven") {
        result = true;
    }
    return n + (result ? " Yes, it's eleven!" : " No, it's not eleven.");
}
console.log(thisIsAEleven(11));
console.log(thisIsAEleven(5));
console.log(thisIsAEleven("11"));
console.log(thisIsAEleven("5"));
console.log(thisIsAEleven("eleven"));
console.log(thisIsAEleven("five"));
