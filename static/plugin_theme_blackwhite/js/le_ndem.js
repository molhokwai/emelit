    <script>
        const show_message = (msg, b, html='') => {
            clear_message()

            if(b === false){
                $('.message').show()
                $('.message').addClass('red')

                if(!html){
                    html = `Une erreur s'est produite / An error occured: ${msg}`
                    html += `<br/>Veuillez réessayer et contacter l'administrateur du site en cas de problème`
                    html += `<br/>/ Please retry and contact the site's administrator if it persists`
                }
            } else {
                html = html || msg
                $('.message').show()
                $('.message').addClass('green2')
            }

            $('.message').html(html)
        }
        const clear_message = () => {
            $('.message').removeClass('red')
            $('.message').removeClass('green2')
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
            }

            $.ajax({
                type: 'post',
                url: '/emelit/plugin_lendem/post.json',
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
                show_message(data.message, false)

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
                url: '/emelit/plugin_lendem/post',
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
                show_message(data.message, false)

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
        /****************
        $('#send-form-contact').on('click', function(e){
            onClickSendData(this.id)
            showhide_loader(true)
        })
        ****************/
        $('#send-form-confirmation').on('click', function(e){
            navigate_form(this.id)
        })

        const getStats = (problem) => {
            let data = {
                'problem': problem,
            }

            $.ajax({
                type: 'get',
                url: '/emelit/plugin_lendem/get_stats.json',
                contentType: 'application/json',
                data: JSON.stringify(data),
            }).done(function (data) {
                setStats(data.values)
                clear_message()

            }).fail(function (data) {
                show_message(data.message, false)

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

            let data = {'1':'1'}
            $.ajax({
                type: 'get',
                url: '/emelit/plugin_lendem/get_users_imgs.json',
                contentType: 'application/json',
                data: JSON.stringify(data),
            }).done(function (data) {

                let user_objs = data.values['users']
                let user_objs_keys = user_objs.keys()
                let n = user_objs_keys.length
                for(let i=0; i<9; i++){
                    let img = $_user_img_default[0].cloneNode()
                    if(i<=n){
                        img.src = user_objs[user_objs_keys].image_url
                        img.title = user_objs[user_objs_keys].firstname
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

        $(document).ready(function(){
            let otherOptionIndices = {}
            $('select').on('change', function(){
                let _visibility = 'hidden'
                if(this.value == 'other'){
                    _visibility = 'visible'
                }

                if(!(this.id in otherOptionIndices)){
                    otherOptionIndices[this.id] = this.selectedIndex
                } else {
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
                url: '/emelit/plugin_lendem/test_get_last_img.json',
                contentType: 'application/json',
                data: JSON.stringify(data),
            }).done(function (data) {
                $('.side-img')[0].src = data.values['url']
                clear_message()

            }).fail(function (data) {
                show_message(data.message, false)

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
    	            url: "/emelit/plugin_lendem/index",
    	            dataType: 'text',
    	            cache: false
    	        });
    	    },
    	    check_pending_requests: function() {
    	        /** src: https://stackoverflow.com/questions/1822913/how-do-i-know-if-jquery-has-an-ajax-request-pending **/
        	    if($.active > max_pending_requests){
            	    disconnect_n++
                    show_message(``, false, `<strong>Déconnecté</strong> <em>(${$.active} requêtes en attente)</em>, depuis ~${Math.ceil(disconnect_n*check_connect_intvl/60000)} minutes...`)
        	    }
    	    },
    	};

    	check_connectivity.is_internet_connected().done(function() {
    	    /** The resource is accessible - you are **probably** online. **/
            if(disconnect_n>0){
                show_message('Connecté!', true)
                disconnect_n = 0
            }

    	}).fail(function(jqXHR, textStatus, errorThrown) {
    	    disconnect_n++
            show_message(``, false, `<strong>Déconnecté</strong>, depuis ~${Math.ceil(disconnect_n*check_connect_intvl/60000)} minutes...`)
    	});

        setInterval(check_connectivity.is_internet_connected, check_connect_intvl)
        setInterval(check_connectivity.check_pending_requests, check_connect_intvl)
    </script>
