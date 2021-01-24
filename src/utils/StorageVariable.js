class StorageVariable {
	constructor(name, defaultVal = null) {
		this.name = name;
		const v = localStorage.getItem(this.name);
		this.val = v ?? defaultVal;
		localStorage.setItem(this.name, this.val);
	}
	
	get value() {
		return this.val;
	}
	
	set value(v) {
		this.val = v;
		localStorage.setItem(this.name, this.val);
	}
}

export default StorageVariable;
