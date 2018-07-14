function Task(id, title){
	this.id = id;
	this.title = title;
	this.isDeleting = ko.observable(false);
}

function ToDoListViewModel() {
	var self = this;
	self.titleTask = ko.observable("");
	self.countIdTasks = 0;
	self.tasks = ko.observableArray([]);
	self.newElement = function(){
		self.tasks.push(new Task(self.countIdTasks++, self.titleTask()));
		self.titleTask("");
	};
	self.changeDeletingStatus = function(selectedTask){
		if(selectedTask.isDeleting()==true)
			selectedTask.isDeleting(false);
	    else
			selectedTask.isDeleting(true);
	};
	self.deleteElement = function(){
		for(var i = 0; i < self.tasks().length; i++)
			if(self.tasks()[i].isDeleting()) {
				self.tasks.splice(i,1);
				i--;
			}		
	}; 
};
var toDoList = new ToDoListViewModel();
ko.applyBindings(toDoList);