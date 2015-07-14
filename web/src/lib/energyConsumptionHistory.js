function EnergyConsumptionHistory(max) {
	this._history = new Array(max);

	for (var i=0; i<max; ++i) {
		this._history[i] = undefined;
	}
	
	this._length = 0;
	this._max = max;
	this._sum = 0;
	this._highest = null;

	this.highest = function() {
		if (this._highest == null) {
			var i;
			var h = null;
			for (i=0; i<this._history.length; ++i) {
				if (h == null || h < this._history[i]) {
					h = this._history[i];
				}
			}
			this._highest = h;
		}

		return this._highest;
	}

	this.average = function() {
		if (this._sum == null) {
			var sum = 0;
			for (var i=0; i<this._history.length; ++i) {
				if (this._history[i] != undefined) {
					sum += this._history[i];
				}
			}
			this._sum = sum;
		}

		if (this._length > 0)
			return this._sum / this._length;
		else
			return 0;
	}

	this.push = function(value) {

		var prevValue = this._history[0];
		this._history.shift();

		if (prevValue == undefined) {
			this._length++;
		}
		else {
			this._sum -= prevValue;
		}
		this._sum += value;
		this._history.push(value);

		if (prevValue == this._highest) {
			this._highest = null;
			this.highest();
		}

		if (this._highest == null || this._highest < value) {
			this._highest = value;
		}

	}

	this.history = function() {
		return this._history;
	}
}
