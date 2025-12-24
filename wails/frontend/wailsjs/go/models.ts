export namespace main {
	
	export class Context {
	    files: string[];
	    notes: string;
	    count: number;
	
	    static createFrom(source: any = {}) {
	        return new Context(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.files = source["files"];
	        this.notes = source["notes"];
	        this.count = source["count"];
	    }
	}

}

