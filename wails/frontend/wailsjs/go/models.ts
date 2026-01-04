export namespace main {
	
	export class Context {
	    name: string;
	    files: string[];
	    notes: string;
	    count: number;
	
	    static createFrom(source: any = {}) {
	        return new Context(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.files = source["files"];
	        this.notes = source["notes"];
	        this.count = source["count"];
	    }
	}
	export class FlashCard {
	    question: string;
	    answer: string;
	    id: string;
	    dueAt: number;
	
	    static createFrom(source: any = {}) {
	        return new FlashCard(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.question = source["question"];
	        this.answer = source["answer"];
	        this.id = source["id"];
	        this.dueAt = source["dueAt"];
	    }
	}
	export class Deck {
	    name: string;
	    Created_at: number;
	    flashCards: FlashCard[];
	
	    static createFrom(source: any = {}) {
	        return new Deck(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.Created_at = source["Created_at"];
	        this.flashCards = this.convertValues(source["flashCards"], FlashCard);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

