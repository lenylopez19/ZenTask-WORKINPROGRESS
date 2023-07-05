$(document).ready(function(){

    function sendDataPost(url,data,func){
        $.post(
         url,
         data,
         function(response,status){
             const isFunc = (typeof func) == "function";
             if(response == 1 && isFunc){
                 func();
             }
     
         });
     }

    async function getData(url,dataType){
        const result = await $.ajax({
           url:url,
           type:"GET",
           dataType:dataType,
       });
   
       return result;
   }

   function loadTasks(){

    let dataArray = [];

    getData("php/readTasks.php","json")
    .then(data => {
        
        for(item of data){
            dataArray.push(item);
            
        }
        populateTasks(dataArray);
    })
   

}

    function populateTasks(arr){
        const insertTo = $(".task__container");
        let layout = "";
        for(entry of arr){
            const completed = (item['completed'] == "1");
            layout += `
            <div id="`+entry['id']+`" class="row_content `+(completed?'completed':'')+`">
                <span class="circle__icon"></span>
                <p>`+entry['task']+`</p>
            </div>
        `;
            
        }
        insertTo.html(layout);
    }



    function TaskSender(){
        const value = $("#taskText").val();
        let data = {
            'task': value,
        }
        sendDataPost("php/WriteData.php",data,loadTasks);
    }


    loadTasks();

    $("#taskForm").submit(function(e){
        e.preventDefault();
        TaskSender();
        $(this).trigger("reset");
    });



    $(".task__container").on("click",".row_content",function(){
        const element = $(this);
        const id = element.attr('id');

        element.toggleClass("completed"); 

        if(element.hasClass('completed')){
            console.log("true comnpleted executed");
           const data = {
                "id":id,
                "completed":1,
            };
            sendDataPost("php/updateTask.php",data,logPhpReturn);

        }else{

        }


    });

function logPhpReturn(){
    console.log("log called");
    console.log(response);
    
}

//test phase

//ajax .json data query.

$(".addTask").click(function(){
    $.ajax({
        url: "json/dat.json",
        type: "GET",
        dataType: "json",
        success: function(datos){
            console.log(datos);
            //each en jqeury
            for(item of datos ){
                console.log(item.nombre);
                $("body").append(item.nombre)+"</br>";
                if($(".container").is(":empty")){
                    console.log("go ahead append");
                }

            }

        },
        error: function(xhr, status, error){
            console.log(xhr);
            console.log(status);
            console.log(error);
            if (xhr.status == "404"){
                alert("couldnt find source, error : "+ error)
            }
        }
    });
})




});


// AJAX EXAMPLES

