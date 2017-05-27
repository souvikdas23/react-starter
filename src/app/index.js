import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import chartjs from 'chart.js';

var jsonData;
$.get('../spotmentor/MOCK_DATA.json', function(data){
	jsonData = data;
})

$('.students').hide();
 
const Class = React.createClass({
	getInitialState: function(){
        return {
            classes: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII']
        }
    }, //getInitialState

	render: function(){
		const classes = this.state.classes;
		return(
			<div>
				<div className = "page-header" style={{"marginTop":-1+"px"}}>
					<b>CLASSES</b>
				</div>
				<ul className="nav nav-pills nav-stacked" >
					{classes.map(function(myclass, i){
				        return <li role="presentation" key={i} data-click={myclass} onClick={this.__renderStudents}><a href="#">{myclass}</a></li>;
				    }.bind(this))}
				</ul>
			</div>
			);
	},

	__renderStudents : function(e){
		$('.students').show();
		$('.jumbotron').hide();

		const myclass = $(e.currentTarget).data('click'),
		 	req_students=$.grep(jsonData, function(item){
				return item.class == myclass; 
		});

		$('.nav-pills li').each(function(){
			$(this).removeClass('active');
		})
		$(e.currentTarget).addClass('active');	
		$('.details').hide();
		renderStudents(req_students);
	}

});

ReactDOM.render(<Class />, document.getElementById('react-id-1'));


const renderStudents = function(req_students){

	const Student = React.createClass({
		getInitialState: function(){
			return{
				students: req_students
			}
		},

		render: function(){
			const students = this.state.students;
			return(
				<div>
				  <div className = "page-header" style={{"marginTop":-1+"px"}}>
					<b>STUDENTS</b>
				</div>
				  <div className="input-group col-md-12" style={{"paddingBottom":10+"px"}}>
				      <input type="text"  className="form-control" placeholder="Search for..." onChange={this.searchStudent}></input>
				      
				  </div>
				  {students.map(function(student, i){
				  	return <a href="#" className="list-group-item" data-student={student.first_name} onClick={this.__renderStudentDetails}key={i}>{student.first_name}</a>;
				  }.bind(this))}
				</div>
				)
		},

		__renderStudentDetails: function(e){
			const student = $(e.currentTarget).data('student'),
		 		req_student=$.grep(req_students, function(item){
					return item.first_name == student; 
				});
		 	$('.list-group-item').each(function(){
				$(this).removeClass('active');
			})
			$(e.currentTarget).addClass('active');	

			//console.log(req_student);

			$('.details').show();
			renderMarksChart(req_student);
			renderStudentDetails(req_student);

		},

		searchStudent: function(e){
			$('.details').hide();
			const search_string = $('.form-control').val(),
				myclass = $('.btn-default').data('class'),
				updated_req_students = $.grep(req_students, function(item){
				/*console.log(item.first_name);*/
				return (item.first_name.toLowerCase()).indexOf(search_string.toLowerCase())>-1;
			});

			console.log(updated_req_students);

			this.setState({
	            students: updated_req_students
	        })
		}
	});

	ReactDOM.render(<Student />, document.getElementById('react-id-2'));
	
};

const renderStudentDetails= function(req_student){

	const StudentDetails = React.createClass({
		getInitialState: function(){
			return{
				student: req_student
			}
		},

		render: function(){
			const student = this.state.student;
			return(
				<div>
					<div className="panel panel-info">
					  <div className="panel-heading">
					    <h3 className="panel-title">{student[0].first_name+ "'s "}Details</h3>
					  </div>	
					  <div className="panel-body">
					    <table>
					    	<tbody>
					    		<tr>
					    			<th scope="row">Name :</th>
					    			<td>{student[0].first_name}</td>
					    		</tr>
					    		<tr>
					    			<th scope="row">Date of Birth :</th>
					    			<td>{student[0].date_of_birth}</td>
					    		</tr>
					    		<tr>
					    			<th scope="row">Gender :</th>
					    			<td>{student[0].gender}</td>
					    		</tr>
					    		<tr>
					    			<th scope="row">Parent/ Guardian :</th>
					    			<td>{student[0].parent_first_name+" "+student[0].last_name}</td>
					    		</tr>
					    	</tbody>
					    </table>
					  </div>
					</div>
				</div>
				)
		}
	});

	ReactDOM.render(<StudentDetails />, document.getElementById('react-id-3'));
};

const renderMarksChart = function(req_student){

	const StudentMarks = React.createClass({
		
		render: function(){
			return(
				<div>
					<div className="panel panel-default">
					  <div className="panel-heading">Marks</div>
					  <div className="panel-body">
					    <canvas id="myChart" width="320" height="250"></canvas>
					  </div>
					</div>
				</div>
				)
		}

	});

	ReactDOM.render(<StudentMarks />, document.getElementById('react-id-4'));

	var data = {
	    labels: ["English", "Maths", "Science"],
	    datasets: [
	        {
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	            ],
	            borderWidth: 1,
	            data: [req_student[0].english_marks, req_student[0].maths_marks, req_student[0].science_marks],
	        }
	    ]
	};

	 //console.log(data);
	 var ctx = document.getElementById("myChart").getContext("2d");
	 var myBarChart = new Chart(ctx, {
		    type: 'bar',
		    data: data,
		    options: {
		    	scales: {
			        yAxes: [{
			            ticks: {
			                beginAtZero: true
			            }
			        }]
			    }
		    }
	 });
};





