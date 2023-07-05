$(document).ready(function(){

    function sendDataPost(url,data,func){
        $.post(
         url,
         data,
         function(response,status){
            console.log(status);
            console.log(response);
             let isFunc = (typeof func) == "function";
             if(isFunc){
                 func();
             }
     
         });
     }

    async function getDataFrom(url,dataType){

        const promise = await $.ajax({
            url:url,
            type:"GET",
            dataType:dataType,
            
        });

        return promise;

   }

   function loadTasks(){
    const element = $(".task__container");
    let layout = "";

    getDataFrom("php/readTasks.php","json")
    .then(data=>{
        for(entry of data){
            const completed = (entry.completed == "1");
            layout += `
            <div id="`+entry.id+`" class="row_content `+(completed?'completed':'')+`">
                <span class="circle__icon"></span>
                <p>`+entry.task+`</p>
            </div>
        `;
        }
        
    })
    .then(function(){
        element.html(layout);
    })
    .catch(error =>{
        console.log(error);
    })
    }


    function TaskSender(){
        const value = $("#taskText").val();
        let data = {
            'task': value,
        }
        sendDataPost("php/WriteData.php",data,loadTasks);
    }


    function setCompletedStatus(task){

        const id = task.attr('id');
        const data = {"id":id};
        task.toggleClass("completed");

        (task.hasClass("completed"))? data["completed"]=1 : data["completed"]=0 ;
        
        sendDataPost("php/updateTask.php",data);
        
    }


    loadTasks();

    $(".task__container").on("click",".row_content",function(){

        setCompletedStatus($(this));

    });

    $("#taskForm").submit(function(e){
        e.preventDefault();
        TaskSender();
        $(this).trigger("reset");
    });


});




