;(function(){
	
	window.Iterator = MyIterator;
	
	function MyIterator(_from, _to){		
		this._from = _from;
		this._to = _to;
		
		var curr = _from;
		
		this.incr = function(){
			if(this._from < this._to) {
				curr++;
			} else if (this._from > this._to) {
				curr--;
			}
			return curr;	
		}		
	}
	
	window.IteratorSecond = MyIteratorSecond;
	
	function MyIteratorSecond(_from, _to){		
		MyIterator.call(this, _from, _to);
		
		this.next = function(){
			var result = this.incr();
			if(result === this._to) {
				var temp = this._from;
				this._from = this._to;
				this._to = temp
			}
			return result;			
		}		
	}	
}());