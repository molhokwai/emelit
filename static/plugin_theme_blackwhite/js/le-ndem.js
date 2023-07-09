const show_message = (msg, b, html='') => {
    clear_message()

    if(b == -1){
        $('.message').show()
        $('.message').addClass('red')

        if(!html){
            html = `Une erreur s'est produite / An error occured: ${msg}`
            html += `<br/>Veuillez réessayer et contacter l'administrateur du site en cas de problème`
            html += `<br/>/ Please retry and contact the site's administrator if it persists`
        }
    } else {
        if(b == 1){
            html = html || msg
            $('.message').show()
            $('.message').addClass('green2')
        } else {
            $('.message').show()
            $('.message').addClass('blackred')
        }
    }

    $('.message').html(html)
}
const clear_message = () => {
    $('.message').removeClass('red')
    $('.message').removeClass('green2')
    $('.message').removeClass('blackred')
    $('.message').html(' ')
    $('.message').hide()
}

const showhide_loader = (b) => {
    if(b){
        $('.lds-default').show()
    } else {
        $('.lds-default').hide()
    }
}


const navigate_form = (_submitterId) => {
    switch(_submitterId){
        case 'send-form-data':
            $('.data-container').hide('slow')

            if(globalData && (globalData['phone'] || globalData['email'])){
                $('.confirmation2-container').show('slow')
            } else {
                $('.contact-container').show('slow')
            }
            break

        case 'send-form-contact':
            $('.contact-container').hide('slow')
            $('.confirmation-container').show('slow')
            break

        case 'send-form-confirmation':
        default:
            $('.confirmation-container').hide('slow')
            $('.data-container').show('slow')
            displayUsersImages()

            $('form.data').trigger('reset')
            break
    }
}

let submitterId
let globalData
const onFormDataSend = (_submitterId) => {
    console.log(`Form submitted by #${_submitterId} ...`)
    submitterId = _submitterId

    const getValueAlternative = (id) => {
        let v = $(`#${id}`).val()
        if(v == 'other'){
            v = $(`#${id}-other`).val()
        }
        return v
    }

    globalData = {
        'id': $('#id').val() || null,
        'provider': getValueAlternative('provider') || null,
        'service': getValueAlternative('service') || null,
        'problem': getValueAlternative('problem') || null,
        'details': $('#details').val() || null,
        'phone': $('#phone').val() || null,
        'email': $('#email').val() || null,
        'firstname': $('#firstname').val() || null,
        'plugin_name': $('#plugin_name').val() || null,
    }

    $.ajax({
        type: 'post',
        url: '/emelit/plugin_urgentwork/post.json',
        contentType: 'application/json',
        data: JSON.stringify(globalData),

    }).done(function (data) {
        $('input[name="id"]').val(data.values.id)

        navigate_form(submitterId)
        if(data.values.stats){
            setStats(data.values.stats)
        }

        clear_message()
        submitterId = null

    }).fail(function (data) {
        show_message(data.message, -1)

    }).always(function (data) {
        showhide_loader(false)
        console.log(`STATUS: ${data.status} - MESSAGE: ${data.message} `)
    });

    return false
}

$('#form-contact').on('submit', function(e){
    /* src:https://stackoverflow.com/questions/19447435/ajax-upload-image */
    e.preventDefault();
    showhide_loader(true)
    submitterId = 'send-form-contact'
    var formData = new FormData(this);

    $.ajax({
        type:'post',
        url: '/emelit/plugin_urgentwork/post',
        data:formData,
        cache:false,
        contentType: false,
        processData: false,
    }).done(function (data) {
        data = JSON.parse(data)
        $('#id').val(data.values.id)

        navigate_form(submitterId)
        if(data.values.stats){
            setStats(data.values.stats)
        }

        clear_message()
        submitterId = null

    }).fail(function (data) {
        data = JSON.parse(data)
        show_message(data.message, -1)

    }).always(function (data) {
        data = JSON.parse(data)
        showhide_loader(false)
        console.log(`STATUS: ${data.status} - MESSAGE: ${data.message} `)
    });

})

const onClickSendData = (_submitterId) => {
    /****************
    {
        'originalEvent' : {
            'submitter': {
                'id':
            }
        }
    }
    ****************/
    onFormDataSend(_submitterId)
}
$('#send-form-data').on('click', function(e){
    onClickSendData(this.id)
    showhide_loader(true)
})
$('#send-form-confirmation').on('click', function(e){
    navigate_form(this.id)
})

const getStats = (problem) => {
    let data = {
        'problem': problem,
    }

    $.ajax({
        type: 'get',
        url: '/emelit/plugin_urgentwork/get_stats.json',
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).done(function (data) {
        setStats(data.values)
        clear_message()

    }).fail(function (data) {
        show_message(data.message, -1)

    }).always(function (data) {
        console.log(`STATUS: ${data.status} - MESSAGE: ${data.message} `)
    });

    return false
}

const setStats = (stats) => {
    for(k in stats){
        $(`.n-${k}`).html(stats[k])
    }
}

let $_user_img_default
let _user_img_n = 9
const displayUsersImages = () => {
    $_user_img_default = $('.users-images img')

    let data = { 'plugin_name': $('#plugin_name').val() }
    $.ajax({
        type: 'get',
        url: '/emelit/plugin_urgentwork/get_users_imgs.json',
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).done(function (data) {

        let user_objs = data.values['users']
        let n = user_objs.length
        for(let i=0; i<9; i++){
            let img = $_user_img_default[0].cloneNode()
            if(i<n){
                img.src = user_objs[i].image_url
                img.title = user_objs[i].firstname
            }
            $('.users-images').append(img)
        }
        $('.users-images img:first').hide()

    }).fail(function (data) {
        console.log(data.message)

    }).always(function (data) {
        // pass
    });
}

let otherOptionIndices = {}
$(document).ready(function(){
    $('select').on('change', function(){
        let _visibility = 'hidden'
        if(this.value == 'other'){
            if(!(this.id in otherOptionIndices)){
                otherOptionIndices[this.id] = this.selectedIndex
            }
            _visibility = 'visible'
        }

        if(this.id in otherOptionIndices){
            $(`#${this.options[otherOptionIndices[this.id]].dataset.other}`).css("visibility", _visibility);
        }
    })

    /* src: https://www.geeksforgeeks.org/preview-an-image-before-uploading-using-jquery */
    $("#image").change(function () {
        const file = this.files[0];
        if (file) {
            let reader = new FileReader()
            reader.onload = function (event) {
                $("#img-preview").attr("src", event.target.result)
                $("#img-preview").show()
            };
            reader.readAsDataURL(file)
        }
    });
    $("#image").change(function () {
        const file = this.files[0];
        if (file) {
            let reader = new FileReader()
            reader.onload = function (event) {
                $("#img-binary").val(event.target.result)
            };
            /* src: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString */
            reader.readAsBinaryString(file)
        }
    });

    $('form.data').on('reset', function(){
        $('#id').val('')
    })

    displayUsersImages()

    showhide_loader(false)
})

$('#test').on('click', function(e){
    let data = {'1':'1'}
    $.ajax({
        type: 'get',
        url: '/emelit/plugin_urgentwork/test_get_last_img.json',
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).done(function (data) {
        $('.side-img')[0].src = data.values['url']
        clear_message()

    }).fail(function (data) {
        show_message(data.message, -1)

    }).always(function (data) {
        // pass
    });

})

let check_connect_intvl = 30000
let disconnect_n = 0
let max_pending_requests = 4
const check_connectivity = {
    is_internet_connected: function() {
        /** src: https://stackoverflow.com/questions/20043215/check-internet-connectivity-with-jquery **/
        return $.get({
            url: "/emelit/plugin_urgentwork/index",
            dataType: 'text',
            cache: false
        }).done(function() {
            /** The resource is accessible: **probably** online. **/
            if(disconnect_n>0){
                show_message('Connecté!', 1)
                disconnect_n = 0
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            disconnect_n++
            let _html = ''
            _html += `<strong>Déconnecté</strong>, depuis ~${Math.ceil(disconnect_n*check_connect_intvl/60000)} minutes `
            _html += `(<a class="red underline" href="javascript:show_message('Essai de connexion...', 0); setTimeout(check_connectivity1.is_internet_connected, 5000)">réessayer</a>)...`
            show_message(``, -1, _html)
        })
    },
    check_pending_requests: function() {
        /** src: https://stackoverflow.com/questions/1822913/how-do-i-know-if-jquery-has-an-ajax-request-pending **/
        if($.active > max_pending_requests){
            disconnect_n++
            let _html = ''
            _html += `<strong>Déconnecté</strong> <em>(${$.active} requêtes en attente)</em>, `
            _html += `depuis ~${Math.ceil(disconnect_n*check_connect_intvl/60000)} minutes... `
            _html += `(<a href="javascript:clear_message(); check_connectivity.is_internet_connected();">réessayer</a>)...`
            show_message(``, -1, _html)
        }
    },
};

setInterval(check_connectivity.is_internet_connected, check_connect_intvl)
setInterval(check_connectivity.check_pending_requests, check_connect_intvl)



/******
 * Code to handle install prompt on desktop
 * src: https://github.com/mdn/pwa-examples/blob/master/a2hs/index.js
 *      <via> https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
 ******/
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', () => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
