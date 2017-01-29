
/* ArrayPartialFill is a collection that has functions to keep
track of which/how many indices have set values */
function ArrayPartialFill(_items, _num_Items_Set) {
	
	/* Hidden members */
	var _items = [];
	var _num_Items_Set = 0;
	
	/* Gets the value at the specificed index */
	this.getItem = function (ind) {
		return _items[ind];
	}
	
	/* Gets the number of indices in the array that have set/defined values  */
	this.getNumberOfValuesSet = function () {
		return _num_Items_Set;
	}
	
	/* Gets whether or not the given index has a set/defined value */
	this.hasValue = function (ind) {
		return (_items[ind] != undefined);
	}
	
	/* Sets the item at the given index to the given value */
	this.setItem = function (ind, val) {
		if (_items[ind] == undefined) {
			_num_Items_Set++;
		}
		else {
			if (val == undefined) {
				_num_Items_Set--;
			}
		}
		_items[ind] = val;
	}
	
	/* Clears all values from the array */
	this.clearList = function () {
		_items = [];
		_num_Items_Set = 0;
	}
	
	/* Prints all the set values in the array */
	this.printValues = function () {
		console.log("Values:");
		for (i of _items) {
			console.log("\b", i);
		}
		console.log("-----");
	}
}