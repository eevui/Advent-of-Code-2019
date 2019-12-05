const fs = require('fs');

class Wire {
	constructor(path) {
		this.path = path;
	}

	static fromLine(line) {
		const splits = line.split(',');
		let prev = null;
		const path = splits.map(split => {
			const direction = split[0];
			const distance = parseInt(split.slice(1), 10);
			const origin = prev ? prev.endCoordinate() : new Coordinate(0, 0);
			prev = new WirePath(origin, direction, distance);
			return prev;
		});
		return new Wire(path);
	}

	intersections(wire) {
		const intersections = this.path.reduce((accumulator, myPath) => {
			return [...accumulator, wire.path.reduce((accumulator, wPath) => {
				if (wPath.intersects(myPath)) {
					return [...accumulator, wPath];
				}
				return accumulator;
			}, [])];
		}, []);
		return intersections.filter(intersection => {
			return intersection.length > 0;
		});
	}
}

class Coordinate {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Range {
	constructor(from, to) {
		this.from = from;
		this.to = to;
	}

	encloses(n) {
		return this.from < n && this.to > n;
	}
}

class WirePath {
	constructor(origin, direction, distance) {
		this.origin = origin;
		this.direction = direction;
		this.distance = distance;
	}

	endCoordinate() {
		switch(this.direction) {
			case 'R':
				return new Coordinate(this.origin.x + this.distance, this.origin.y);
			case 'L':
				return new Coordinate(this.origin.x - this.distance, this.origin.y);
			case 'U':
				return new Coordinate(this.origin.x, this.origin.y + this.distance);
			case 'D':
				return new Coordinate(this.origin.x, this.origin.y - this.distance);
		}
	}

	horizontal() {
		return this.direction === 'R' || this.direction === 'L';
	}

	rangeX() {
		if (this.horizontal()) {
			const a = this.origin.x;
			const b = this.endCoordinate().x;
			if (a > b) {
				return new Range(b, a);
			} else {
				return new Range(a, b);
			}
		}
		return new Range(this.origin.x, this.origin.x);
	}

	rangeY() {
		if (!this.horizontal()) {
			const a = this.origin.y;
			const b = this.endCoordinate().y;
			if (a > b) {
				return new Range(b, a);
			} else {
				return new Range(a, b);
			}
		}
		return new Range(this.origin.y, this.origin.y);
	}

	intersects(wirePath) {
		if(this.horizontal() === wirePath.horizontal()) {
			return false;
		}
		if (this.horizontal()) {
			return this.rangeX().encloses(wirePath.origin.x) && wirePath.rangeY().encloses(this.origin.y);
		} else {
			return this.rangeY().encloses(wirePath.origin.y) && wirePath.rangeX().encloses(this.origin.x);
		}
	}
}

fs.readFile('./input', (error, input) => {
	const lines = input.toString().split('\n');
	const wires = lines.slice(0, 2).map(line => {
		return Wire.fromLine(line);
	});
	console.log(wires[0].intersections(wires[1]));
});
