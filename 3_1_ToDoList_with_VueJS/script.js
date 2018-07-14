let app = new Vue({
	el: '#todoVue',
	data: {
		countIdTasks:0,
		titleTask:'',
		tasks: []
	},
	methods:{
		newElement:function(){
			this.tasks.push({id:this.countIdTasks++, title:this.titleTask, isDeleting:false});
			this.titleTask = '';
		},
		deleteElement:function(){
			for(let i = 0; i < this.tasks.length; i++)
				if(this.tasks[i].isDeleting) {
					this.tasks.splice(i,1);
					i--;
				}
		}
	}
});