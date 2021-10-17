ArrayMultiDimensional = class {
    constructor(sizes, offsets) {
        this.sizes = sizes;
        this.offsets = offsets || [];
        this.arr = [];
    }

    IndicesToIndex(indices) {
        let result = 0;
        for (let i = 0; i < this.sizes.length || i < indices.length || i < this.offsets.length; i++) {
            result *= (this.sizes[i] || 1);
            result += (indices[i] || 0) - (this.offsets[i] || 0);
        }
        return result;
    }

    Get(indices) {
        return this.arr[this.IndicesToIndex(indices)];
    }

    Set(indices, value) {
        this.arr[this.IndicesToIndex(indices)] = value;
    }

    forEach(action) {
        this.arr.forEach(value => action(value));
    }

    IndicesInRange(indices) {
        for (let i = 0; i < this.sizes.length || i < indices.length || i < this.offsets.length; i++) {
            if (indices[i] % 1 !== 0) {
                return false;
            }
            if ((indices[i] || 0) < (this.offsets[i] || 0)) {
                return false;
            }
            if ((indices[i] || 0) >= (this.offsets[i] || 0) + (this.sizes[i] || 1)) {
                return false;
            }
        }
        return true;
    }
}