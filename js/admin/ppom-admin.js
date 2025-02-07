"use strict";
jQuery(function($) {

    var loader = new ImageLoader(ppom_vars.loader);
    // define your 'onreadystatechange'
    loader.loadEvent = function(url, imageAsDom) {

        $("#ppom-pre-loading").hide();
        $(".ppom-admin-wrap").show();
    }
    loader.load();

    /*********************************
     *       PPOM Form Design JS       *
     **********************************/


    /*-------------------------------------------------------
        
        ------ Its Include Following Function -----

        1- Submit PPOM Form Fields
        2- Hide And Show Import & Export & Product Meta blocks
        3- Get Last Field Index
        4- Show And Hide Visibility Role Field
        5- Remove Unsaved Fields
        6- Check And Uncheck All Fields
        7- Remove Check Fields
        8- On Fields Options Handle Add Option Last
        9- Edit Existing Fields
        10- Add New Fields
        11- Update Existing Fields
        12- Clone New Fields
        13- Clone Existing Fields
        14- Saving PPOM IDs In Existing Meta File
        15- Open Product Modal In Existing Meta File (removed)
        16- Handle Fields Tabs
        17- Handle Media Images Of Following Inputs Types
        18- Add Fields Conditions
        19- Add Fields Options
        20- Auto Generate Option IDs
        21- Create Field data_name By Thier Title
        22- Fields Sortable
        23- Fields Option Sortable
        24- Fields Dataname Must Be Required
        25- Fields Add Option Index Controle Funtion
        26- Fields Add Condition Index Controle Function
        27- Get All Fields Title On Condition Element Value After Click On Condition Tab
        28- validate API WooCommerce Product
    ------------------------------------------------------------*/


    /**
        PPOM Model
    **/
    var append_overly_model = ("<div class='ppom-modal-overlay ppom-js-modal-close'></div>");

    $(document).on('click', '[data-modal-id]', function(e) {
        e.preventDefault();
        $("body").append(append_overly_model);
        var modalBox = $(this).attr('data-modal-id');
        $('#' + modalBox).fadeIn();
    });

    ppom_close_popup();

    function ppom_close_popup() {

        $(".ppom-js-modal-close, .ppom-modal-overlay").click(function(e) {

            var target = $(e.target);
            if (target.hasClass("ppom-modal-overlay")) {
                return false;
            }
            $(".ppom-modal-box, .ppom-modal-overlay").fadeOut('fast', function() {
                $(".ppom-modal-overlay").remove();
            });

        });
    }


    $('.ppom-color-picker-init').wpColorPicker();


    /**
        1- Submit PPOM Form Fields
    **/
    $(".ppom-save-fields-meta").on('submit', function(e) {
        e.preventDefault();

        jQuery(".ppom-meta-save-notice").html('<img src="' + ppom_vars.loader + '">').show();

        $('.ppom-unsave-data').remove();

        var data = $(this).serialize();

        $.post(ajaxurl, data, function(resp) {

            const bg_color = resp.status == 'success' ? '#4e694859' : '#ee8b94';
            jQuery(".ppom-meta-save-notice").html(resp.message).css({ 'background-color': bg_color, 'padding': '8px', 'border-left': '5px solid #008c00' });
            if (resp.status == 'success') {
                if (resp.redirect_to != '') {
                    window.location = resp.redirect_to;
                }
                else {
                    window.location.reload(true);
                }
            }
        }, 'json');

    });


    /**
        2- Hide And Show Import & Export & Product Meta blocks
    **/
    $('.ppom-import-export-btn').on('click', function(event) {
        event.preventDefault();
        $('.ppom-more-plugins-block').hide();
        $(".ppom-import-export-block").show();
        $(".ppom-product-meta-block").hide();
    });

    $('.ppom-cancle-import-export-btn').on('click', function(event) {
        event.preventDefault();
        $('.ppom-more-plugins-block').show();
        $(".ppom-import-export-block").hide();
        $(".ppom-product-meta-block").show();
    });


    /**
        3- Get Last Field Index
    **/
    var field_no = $('#field_index').val();


    /**
        4- Show And Hide Visibility Role Field
    **/
    $('.ppom-slider').find('[data-meta-id="visibility_role"]').removeClass('ppom_handle_fields_tab').hide();
    $('.ppom_save_fields_model .ppom-slider').each(function(i, div) {
        var visibility_value = $(div).find('[data-meta-id="visibility"] select').val();
        if (visibility_value == 'roles') {
            $(div).find('[data-meta-id="visibility_role"]').show();
        }
    });
    $(document).on('change', '[data-meta-id="visibility"] select', function(e) {
        e.preventDefault();

        var div = $(this).closest('.ppom-slider');
        var visibility_value = $(this).val();
        // console.log(visibility_value);
        if (visibility_value == 'roles') {
            div.find('[data-meta-id="visibility_role"]').show();
        }
        else {
            div.find('[data-meta-id="visibility_role"]').hide();
        }
    });


    /**
        5- Remove Unsaved Fields
    **/
    $(document).on('click', '.ppom-close-fields', function(event) {
        event.preventDefault();

        $(this).closest('.ppom-slider').addClass('ppom-unsave-data');
    });


    /**
        6- Check And Uncheck All Fields
    **/
    $('.ppom-main-field-wrapper').on('change', '.onoffswitch-checkbox', function(event) {
        var div = $(this).closest('div');
        if ($(this).prop('checked')) {
            div.find('input[type="hidden"]').val('on');
        }
        else {
            div.find('input[type="hidden"]').val('off');
        }
    });

    $('.ppom-main-field-wrapper').on('click', '.ppom-check-all-field input', function(event) {
        if ($(this).prop('checked')) {
            $('.ppom_field_table .ppom-checkboxe-style input[type="checkbox"]').prop('checked', true);
        }
        else {
            $('.ppom_field_table .ppom-checkboxe-style input[type="checkbox"]').prop('checked', false);
        }
    });
    $('.ppom-main-field-wrapper').on('change', '.ppom_field_table tbody .ppom-checkboxe-style input[type="checkbox"]', function(event) {
        if ($('.ppom_field_table tbody .ppom-checkboxe-style input[type="checkbox"]:checked').length == $('.ppom_field_table tbody .ppom-checkboxe-style input[type="checkbox"]').length) {
            $('.ppom-check-all-field input').prop('checked', true);
        }
        else {
            $('.ppom-check-all-field input').prop('checked', false);
        }
    });


    /**
        7- Remove Check Fields
    **/
    $('.ppom-main-field-wrapper').on('click', '.ppom_remove_field', function(e) {
        e.preventDefault();

        var check_field = $('.ppom-check-one-field input[type="checkbox"]:checked');

        if (check_field.length > 0) {
            swal.fire({
                title: "Are you sure",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55 ",
                cancelButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            }).then( (result ) => {
                    if (!result.isConfirmed) return;

                $('.ppom_field_table').find('.ppom-check-one-field input').each(function(i, meta_field) {

                    if (this.checked) {
                        var field_id = $(meta_field).val();
                        // console.log(field_id)
                        $(meta_field).parent().parent().parent('.row_no_' + field_id + '').remove();
                    }
                    $('.ppom_save_fields_model').find('#ppom_field_model_' + field_id + '').remove();
                });
            });
        }
        else {
            swal.fire("Please at least check one field!", "", "error");
        }
    });


    /**
        8- On Fields Options Handle Add Option Last
    **/
    $('.webcontact-rules').each(function(i, meta_field) {

        var selector_btn = $(this).closest('.ppom-slider');
        selector_btn.find('.ppom-add-rule').not(':last').removeClass('ppom-add-rule').addClass('ppom-remove-rule')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<i class="fa fa-minus" aria-hidden="true"></i>');

    });
    // $('.data-options').each(function(i, meta_field){

    //     var selector_btn = $(this).closest('.ppom-slider');
    //     selector_btn.find('.ppom-add-option').not(':last').removeClass('ppom-add-option').addClass('ppom-remove-option')
    //    .removeClass('btn-success').addClass('btn-danger')
    //    .html('<i class="fa fa-minus" aria-hidden="true"></i>');

    // });


    /**
        9- Edit Existing Fields
    **/
    $(document).on('click', '.ppom-edit-field', function(event) {
        event.preventDefault();

        var the_id = $(this).attr('id');
        $('#ppom_field_model_' + the_id + '').find('.ppom-close-checker').removeClass('ppom-close-fields');
    });


    /**
        10- Add New Fields
    **/
    $(document).on('click', '.ppom-add-field', function(event) {
        event.preventDefault();

        var $this = $(this);
        var ui = ppom_required_data_name($this);
        if (ui == false) {
            return;
        }

        var copy_model_id = $(this).attr('data-copy-model-id');
        var id = $(this).attr('data-field-index');
        id = Number(id);
        // console.log(id);

        var field_title = $('#ppom_field_model_' + id + '').find('.ppom-modal-body .ppom-fields-actions').attr('data-table-id');
        var data_name = $('#ppom_field_model_' + id + '').find('[data-meta-id="data_name"] input').val();
        var title = $('#ppom_field_model_' + id + '').find('[data-meta-id="title"] input').val();
        var placeholder = $('#ppom_field_model_' + id + '').find('[data-meta-id="placeholder"] input').val();
        var required = $('#ppom_field_model_' + id + '').find('[data-meta-id="required"] input').prop('checked');
        var type = $(this).attr('data-field-type');

        // console.log(field_title);

        if (required == true) {
            var _ok = 'Yes';
        }
        else {
            _ok = 'No';
        }
        if (placeholder == null) {
            placeholder = '-';
        }

        var html = '<tr class="row_no_' + id + '" id="ppom_sort_id_' + id + '">';
        html += '<td class="ppom-sortable-handle"><i class="fa fa-arrows" aria-hidden="true"></i></td>';
        html += '<td class="ppom-check-one-field ppom-checkboxe-style">';
        html += '<label>';
        html += '<input type="checkbox" value="' + id + '">';
        html += '<span></span>';
        html += '</label>';
        html += '</td>';

        html += '<td>';
        html += '<div class="onoffswitch">';
        html += '<input checked type="checkbox" name="ppom[' + id + '][status]" class="onoffswitch-checkbox" id="ppom-onoffswitch-' + id + '" tabindex="0">';
        html += '<label class="onoffswitch-label" for="ppom-onoffswitch-' + id + '">';
        html += '<span class="onoffswitch-inner"></span>';
        html += '<span class="onoffswitch-switch"></span>';
        html += '</label>';
        html += '</div>';
        html += '</td>';

        // html += '<td class="ppom-check-one-field"><input type="checkbox" value="'+id+'"></td>';
        html += '<td class="ppom_meta_field_id">' + data_name + '</td>';
        html += '<td class="ppom_meta_field_type">' + type + '</td>';
        html += '<td class="ppom_meta_field_title">' + title + '</td>';
        html += '<td class="ppom_meta_field_plchlder">' + placeholder + '</td>';
        html += '<td class="ppom_meta_field_req">' + _ok + '</td>';
        html += '<td>';
        html += '<button class="ppom_copy_field btn" id="' + id + '" data-field-type="' + field_title + '" style="margin-right: 4px;"><i class="fa fa-clone" aria-hidden="true"></i></button>';
        html += '<button class="ppom-edit-field btn" id="' + id + '" data-modal-id="ppom_field_model_' + id + '"><i class="fa fa-pencil" aria-hidden="true"></i></button>';
        html += '</td>';
        html += '</tr>';

        // console.log(copy_model_id);
        if (copy_model_id != '' && copy_model_id != undefined) {
            $(html).find('.ppom_field_table tbody').end().insertAfter('#ppom_sort_id_' + copy_model_id + '');
        }
        else {
            $(html).appendTo('.ppom_field_table tbody');
        }

        $(".ppom-modal-box, .ppom-modal-overlay").fadeOut('fast', function() {
            $(".ppom-modal-overlay").remove();
        });

        $(this).removeClass('ppom-add-field').addClass('ppom-update-field');
        $(this).html('Update Field');

    });


    /**
        11- Update Existing Fields
    **/
    $(document).on('click', '.ppom-update-field', function(event) {
        event.preventDefault();

        var $this = $(this);
        var ui = ppom_required_data_name($this);

        if (ui == false) {
            return;
        }

        var id = $(this).attr('data-field-index');
        id = Number(id);

        var data_name = $('#ppom_field_model_' + id + '').find('[data-meta-id="data_name"] input').val();
        var title = $('#ppom_field_model_' + id + '').find('[data-meta-id="title"] input').val();
        var placeholder = $('#ppom_field_model_' + id + '').find('[data-meta-id="placeholder"] input').val();
        var required = $('#ppom_field_model_' + id + '').find('[data-meta-id="required"] input').prop('checked');
        var type = $(this).attr('data-field-type');

        if (required == true) {
            var _ok = 'Yes';
        }
        else {
            _ok = 'No';
        }

        var row = $('.ppom_field_table tbody').find('.row_no_' + id);

        row.find(".ppom_meta_field_title").html(title);
        row.find(".ppom_meta_field_id").html(data_name);
        row.find(".ppom_meta_field_type").html(type);
        row.find(".ppom_meta_field_plchlder").html(placeholder);
        row.find(".ppom_meta_field_req").html(_ok);

        $(".ppom-modal-box, .ppom-modal-overlay").fadeOut('fast', function() {
            $(".ppom-modal-overlay").remove();
        });
    });


    /**
        12- Clone New Fields
    **/
    var option_index = 0;
    $(document).on('click', '.ppom_select_field', function(event) {
        event.preventDefault();

        $('#ppom_fields_model_id').find('.ppom-js-modal-close').trigger('click');

        var field_type = $(this).data('field-type');
        var clone_new_field = $(".ppom-field-" + field_type + ":last").clone();

        // field attr name apply on all fields meta with ppom-meta-field class
        clone_new_field.find('.ppom-meta-field').each(function(i, meta_field) {
            var field_name = 'ppom[' + field_no + '][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });

        // fields options sortable
        clone_new_field.find(".ppom-options-sortable").sortable();

        // add fields index in data-field-no
        clone_new_field.find(".ppom-fields-actions").attr('data-field-no', field_no);

        // fields conditions handle name attr
        clone_new_field.find('.ppom-condition-visible-bound').each(function(i, meta_field) {
            var field_name = 'ppom[' + field_no + '][conditions][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });

        clone_new_field.find('.ppom-fields-actions [data-meta-id="visibility_role"]').hide();

        var field_model_id = 'ppom_field_model_' + field_no + '';

        clone_new_field.find('.ppom_save_fields_model').end().appendTo('.ppom_save_fields_model').attr('id', field_model_id);
        clone_new_field.find('.ppom-field-checker').attr('data-field-index', field_no);
        clone_new_field.find('.ppom-field-checker').addClass('ppom-add-fields-js-action');

        // var color_picker_input = clone_new_field.find('.ppom-color-picker-init').clone();
        // clone_new_field.find('.ppom-color-picker-cloner').html(color_picker_input);
        // clone_new_field.find('.ppom-color-picker-init').wpColorPicker();
        // $('.ppom-color-picker-init').wpColorPicker();
        // $('.ppom-color-picker-init').wpColorPicker();

        // $('.ppom-color-picker-init').wpColorPicker('destroy');


        clone_new_field.addClass('ppom_sort_id_' + field_no + '');
        var field_index = field_no;

        // handle multiple options
        var ppom_option_type = '';
        var option_selector = clone_new_field.find('.ppom-option-keys');
        var option_controller = clone_new_field.find('.ppom-fields-option');
        var add_cond_selector = clone_new_field.find('.ppom-conditional-keys');

        // for address addon
        var address_selector = clone_new_field.find('.ppom-checkout-field');
        var address_table_id = clone_new_field.find('.ppom_address_table');
        ppom_create_address_index(address_selector, field_index, address_table_id);

        var wpcolor_selector = clone_new_field.find('.ppom-color-picker-cloner');
        ppom_wp_color_handler(wpcolor_selector, field_index, option_index);

        ppom_create_option_index(option_selector, field_index, option_index, ppom_option_type);
        ppom_option_controller(option_controller, field_index, option_index, ppom_option_type);
        ppom_add_condition_set_index(add_cond_selector, field_index, field_type, option_index);

        // popup fields on model
        ppom_close_popup();
        $('#ppom_field_model_' + field_no + '').fadeIn();

        field_no++;
    });


    /**
        13- Clone Existing Fields
    **/
    var copy_no = 0;
    $('.ppom-main-field-wrapper').on('click', '.ppom_copy_field', function(e) {
        e.preventDefault();

        var model_id_no = $(this).attr('id');

        var field_type = $(this).data('field-type');
        // console.log(model_id_no);

        var clone_new_field = $('.ppom_save_fields_model #ppom_field_model_' + model_id_no + '').clone(true);
        // clone_new_field.find('.ppom_save_fields_model').end().appendTo('.ppom_save_fields_model').attr('id','ppom_field_model_'+field_no+'');
        clone_new_field.find('.ppom_save_fields_model').end().insertAfter('#ppom_field_model_' + model_id_no + '').attr('id', 'ppom_field_model_' + field_no + '');
        clone_new_field.find('.ppom-add-fields-js-action').attr('data-field-index', field_no);
        clone_new_field.find('.ppom-close-fields').attr('data-field-index', field_no);
        clone_new_field.find('.ppom-js-modal-close').addClass('ppom-close-fields');
        clone_new_field.find('.ppom-add-fields-js-action').removeClass('ppom-update-field');
        clone_new_field.find('.ppom-add-fields-js-action').attr('data-copy-model-id', model_id_no);
        clone_new_field.find('.ppom-add-fields-js-action').addClass('ppom-add-field');
        clone_new_field.find('.ppom-add-fields-js-action').addClass('ppom-insertafter-field');
        clone_new_field.find('.ppom-add-fields-js-action').html('Add Field');
        clone_new_field.removeClass('ppom_sort_id_' + model_id_no + '');
        clone_new_field.addClass('ppom_sort_id_' + field_no + '');

        // field attr name apply on all fields meta with ppom-meta-field class 
        clone_new_field.find('.ppom-meta-field').each(function(i, meta_field) {
            var field_name = 'ppom[' + field_no + '][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });

        // fields options sortable
        clone_new_field.find(".ppom-options-sortable").sortable();

        // add fields index in data-field-no
        clone_new_field.find(".ppom-fields-actions").attr('data-field-no', field_no);

        // fields conditions handle name attr
        clone_new_field.find('.ppom-condition-visible-bound').each(function(i, meta_field) {
            var field_name = 'ppom[' + field_no + '][conditions][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });

        clone_new_field.find('.ppom-fields-actions [data-meta-id="visibility_role"]').hide();


        var field_index = field_no;

        // handle multiple options
        var ppom_option_type = 'ppom_copy_option';
        var option_selector = clone_new_field.find('.ppom-option-keys');
        var add_cond_selector = clone_new_field.find('.ppom-conditional-keys');
        var eventcalendar_selector = clone_new_field.find('.ppom-eventcalendar-field');
        var image_option_selector = clone_new_field.find('[data-table-id="image"] .data-options, [data-table-id="imageselect"] .data-options');

        // reset option to one
        // clone_new_field.find('[data-table-id="image"] .data-options').remove();
        clone_new_field.find('[data-table-id="audio"] .pre-upload-box li').remove();
        // clone_new_field.find('[data-table-id="imageselect"] .pre-upload-box li').remove();
        // clone_new_field.find('.data-options').not(':last').remove();
        clone_new_field.find('.webcontact-rules').not(':last').remove();

        // set existing conditions meta
        $(clone_new_field).find('select[data-metatype="elements"]').each(function(i, condition_element) {

            var existing_value1 = $(condition_element).attr("data-existingvalue");
            if ($.trim(existing_value1) !== '') {
                jQuery(condition_element).val(existing_value1);
            }
        });
        $(clone_new_field).find('select[data-metatype="element_values"]').each(function(i, condition_element) {

            var div = $(this).closest('.webcontact-rules');
            var existing_value1 = $(condition_element).attr("data-existingvalue");

            if ($.trim(existing_value1) !== '') {
                jQuery(condition_element).val(existing_value1);
            }
        });

        var wpcolor_selector = clone_new_field.find('.ppom-color-picker-cloner');
        ppom_wp_color_handler(wpcolor_selector, field_index, option_index);

        ppom_create_option_index(option_selector, field_index, option_index, ppom_option_type);
        var option_controller = clone_new_field.find('.ppom-fields-option');

        ppom_option_controller(option_controller, field_index, option_index, ppom_option_type);
        ppom_add_condition_set_index(add_cond_selector, field_index, field_type, option_index);

        // for eventcalendar changing index
        ppom_eventcalendar_set_index(eventcalendar_selector, field_index);

        // set index for all images fields
        image_option_selector.find('input').each(function(img_index, img_meta) {

            var opt_in = $(img_meta).attr('data-opt-index');
            var field_name = 'ppom[' + field_index + '][images][' + opt_in + '][' + $(img_meta).attr('data-metatype') + ']';
            $(img_meta).attr('name', field_name);
        });

        // popup fields on model
        $("body").append(append_overly_model);
        ppom_close_popup();
        $('#ppom_field_model_' + field_no + '').fadeIn();

        field_no++;
    });


    /**
        14- Saving PPOM IDs In Existing Meta File
    **/
    $("#ppom-product-form").on('submit', function(ev) {

        //@Fayaz: Add blockui here
        ev.preventDefault();

        var dataTable = $(".ppom-table").DataTable();

        var attached_cb = [];
        var removed_cb = [];

        dataTable.rows().nodes().to$().find('input[type="checkbox"]').each(function() {
            if (this.checked && this.name == 'ppom_attached[]') {
                attached_cb.push($(this).val());
            }

            if (this.checked && this.name == 'ppom_removed[]') {
                removed_cb.push($(this).val());
            }
        });
        
        
        var data = {
            'action': 'ppom_attach_ppoms',
            'ppom_attached': attached_cb,
            'ppom_removed': removed_cb,
            'ppom_id': $("#ppom_id").val(),
            'ppom_attached_nonce':$("#ppom_attached_nonce").val()
        };

        // return;
        $.post(ajaxurl, data, function(resp) {

            alert(resp.message);
            window.location.reload();

        }, 'json');
    });


    /**
        16- Handle Fields Tabs
    **/
    $('.ppom-control-all-fields-tabs').hide();
    $('.ppom_handle_fields_tab').show();
    $(document).on('click', '.ppom-tabs-label', function() {

        var id = $(this).attr('id');
        var selectedTab = $(this).parent();
        var fields_wrap = selectedTab.parent();
        selectedTab.find('.ppom-tabs-label').removeClass('ppom-active-tab');
        $(this).addClass('ppom-active-tab');
        var content_box = fields_wrap.find('.ppom-control-all-fields-tabs');
        content_box.hide();
        fields_wrap.find('.ppom_handle_' + id).fadeIn(200);
    });


    /**
        17- Handle Media Images Of Following Inputs Types
            17.1- Pre-Images Type
            17.2- Audio Type
            17.3- Imageselect Type
    **/
    var $uploaded_image_container;
    $(document).on('click', '.ppom-pre-upload-image-btn', function(e) {
        e.preventDefault();

        var meta_type = $(this).attr('data-metatype');
        $uploaded_image_container = $(this).closest('div');
        var image_append = $uploaded_image_container.find('ul');
        var option_index = parseInt($uploaded_image_container.find('#ppom-meta-opt-index').val());
        var main_wrapper = $(this).closest('.ppom-slider');
        var field_index = main_wrapper.find('.ppom-fields-actions').attr('data-field-no');
        var price_placeholder = 'Price (fix or %)';

        var wp_media_type = 'image';
        if (meta_type == 'audio') {
            wp_media_type = 'audio,video';
        }

        var button = $(this),
            custom_uploader = wp.media({
                title: 'Choose File',
                library: {
                    type: wp_media_type
                },
                button: {
                    text: 'Upload'
                },
                multiple: true
            }).on('select', function() {

                var attachments = custom_uploader.state().get('selection').toJSON();

                attachments.map((meta, index) => {
                    // console.log(meta);
                    var fileurl = meta.url;
                    var fileid = meta.id;
                    var filename = meta.filename;
                    var file_title = meta.title;


                    var img_icon = '<img width="60" src="' + fileurl + '" style="width: 34px;">';
                    var url_field = '<input placeholder="url" type="text" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][url]" class="form-control" data-opt-index="' + option_index + '" data-metatype="url">';

                    if (meta.type !== 'image') {
                        var img_icon = '<img width="60" src="' + meta.icon + '" style="width: 34px;">';
                        url_field = '';
                    }

                    var price_metatype = 'price';
                    var stock_metatype = 'stock';
                    var stock_placeholder = 'Stock';

                    // Set name key for imageselect addon
                    if (meta_type == 'imageselect') {
                        var class_name = 'data-options ui-sortable-handle';
                        var condidtion_attr = 'image_options';
                        meta_type = 'images';
                        price_placeholder = 'Price';
                        url_field = '<input placeholder="Description" type="text" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][description]" class="form-control" data-opt-index="' + option_index + '" data-metatype="description">';
                    }
                    else if (meta_type == 'images') {
                        var class_name = 'data-options ui-sortable-handle';
                        var condidtion_attr = 'image_options';
                    }
                    else if (meta_type == 'conditional_meta') {
                        meta_type = 'images';
                        var class_name = 'data-options ui-sortable-handle';
                        var condidtion_attr = 'image_options';
                        price_placeholder = 'Meta IDs';
                        price_metatype = 'meta_id';
                    }
                    else {
                        var class_name = '';
                        var condidtion_attr = '';
                    }

                    if (fileurl) {
                        var image_box = '';
                        image_box += '<li class="' + class_name + '" data-condition-type="' + condidtion_attr + '">';
                        image_box += '<span class="dashicons dashicons-move" style="margin-bottom: 7px;margin-top: 2px;"></span>';
                        image_box += '<span class="ppom-uploader-img-title"></span>';
                        image_box += '<div style="display: flex;">';
                        image_box += '<div class="ppom-uploader-img-center">';
                        image_box += img_icon;
                        image_box += '</div>';
                        image_box += '<input type="hidden" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][link]" value="' + fileurl + '" data-opt-index="' + option_index + '" data-metatype="link">';
                        image_box += '<input type="hidden" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][id]" value="' + fileid + '" data-opt-index="' + option_index + '" data-metatype="id">';
                        image_box += '<input type="text" placeholder="Title" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][title]" class="form-control ppom-image-option-title" data-opt-index="' + option_index + '" data-metatype="title" value="' + file_title + '">';
                        image_box += '<input class="form-control" type="text" placeholder="' + price_placeholder + '" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][' + price_metatype + ']" class="form-control" data-opt-index="' + option_index + '" data-metatype="' + price_metatype + '">';

                        if (meta_type != 'audio') {
                            image_box += '<input class="form-control" type="text" placeholder="' + stock_placeholder + '" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][' + stock_metatype + ']" class="form-control" data-opt-index="' + option_index + '" data-metatype="' + stock_metatype + '">';
                        }

                        image_box += url_field;
                        image_box += '<button class="btn btn-danger ppom-pre-upload-delete" style="height: 35px;"><i class="fa fa-times" aria-hidden="true"></i></button>';
                        image_box += '</div>';
                        image_box += '</li>';

                        $(image_box).appendTo(image_append);

                        option_index++;
                    }

                });

                $uploaded_image_container.find('#ppom-meta-opt-index').val(option_index);

            }).open();
    });

    var $uploaded_image_container;
    $(document).on('click', '.ppom-pre-upload-image-btnsd', function(e) {

        e.preventDefault();
        var meta_type = $(this).attr('data-metatype');
        $uploaded_image_container = $(this).closest('div');
        var image_append = $uploaded_image_container.find('ul');
        var option_index = parseInt($uploaded_image_container.find('#ppom-meta-opt-index').val());
        $uploaded_image_container.find('#ppom-meta-opt-index').val(option_index + 1);
        var main_wrapper = $(this).closest('.ppom-slider');
        var field_index = main_wrapper.find('.ppom-fields-actions').attr('data-field-no');
        var price_placeholder = 'Price (fix or %)';
        wp.media.editor.send.attachment = function(props, attachment) {
            // console.log(attachment);
            var existing_images;
            var fileurl = attachment.url;
            var fileid = attachment.id;
            var img_icon = '<img width="60" src="' + fileurl + '" style="width: 34px;">';
            var url_field = '<input placeholder="url" type="text" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][url]" class="form-control" data-opt-index="' + option_index + '" data-metatype="url">';

            if (attachment.type !== 'image') {
                var img_icon = '<img width="60" src="' + attachment.icon + '" style="width: 34px;">';
                url_field = '';
            }

            var price_metatype = 'price';
            var stock_metatype = 'stock';
            var stock_placeholder = 'Stock';

            // Set name key for imageselect addon
            if (meta_type == 'imageselect') {
                var class_name = 'data-options ui-sortable-handle';
                var condidtion_attr = 'image_options';
                meta_type = 'images';
                price_placeholder = 'Price';
                url_field = '<input placeholder="Description" type="text" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][description]" class="form-control" data-opt-index="' + option_index + '" data-metatype="description">';
            }
            else if (meta_type == 'images') {
                var class_name = 'data-options ui-sortable-handle';
                var condidtion_attr = 'image_options';
            }
            else if (meta_type == 'conditional_meta') {
                meta_type = 'images';
                var class_name = 'data-options ui-sortable-handle';
                var condidtion_attr = 'image_options';
                price_placeholder = 'Meta IDs';
                price_metatype = 'meta_id';
            }
            else {
                var class_name = '';
                var condidtion_attr = '';
            }

            if (fileurl) {
                var image_box = '';
                image_box += '<li class="' + class_name + '" data-condition-type="' + condidtion_attr + '">';
                image_box += '<span class="dashicons dashicons-move" style="margin-bottom: 7px;margin-top: 2px;"></span>';
                image_box += '<span class="ppom-uploader-img-title"></span>';
                image_box += '<div style="display: flex;">';
                image_box += '<div class="ppom-uploader-img-center">';
                image_box += img_icon;
                image_box += '</div>';
                image_box += '<input type="hidden" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][link]" value="' + fileurl + '" data-opt-index="' + option_index + '" data-metatype="link">';
                image_box += '<input type="hidden" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][id]" value="' + fileid + '" data-opt-index="' + option_index + '" data-metatype="id">';
                image_box += '<input type="text" placeholder="Title" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][title]" class="form-control ppom-image-option-title" data-opt-index="' + option_index + '" data-metatype="title">';
                image_box += '<input class="form-control" type="text" placeholder="' + price_placeholder + '" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][' + price_metatype + ']" class="form-control" data-opt-index="' + option_index + '" data-metatype="' + price_metatype + '">';
                image_box += '<input class="form-control" type="text" placeholder="' + stock_placeholder + '" name="ppom[' + field_index + '][' + meta_type + '][' + option_index + '][' + stock_metatype + ']" class="form-control" data-opt-index="' + option_index + '" data-metatype="' + stock_metatype + '">';
                image_box += url_field;
                image_box += '<button class="btn btn-danger ppom-pre-upload-delete" style="height: 35px;"><i class="fa fa-times" aria-hidden="true"></i></button>';
                image_box += '</div>';
                image_box += '</li>';

                $(image_box).appendTo(image_append);
            }
        }

        wp.media.editor.open(this);

        return false;
    });
    $(document).on('click', '.ppom-pre-upload-delete', function(e) {

        e.preventDefault();
        $(this).closest('li').remove();
    });


    /**
        18- Add Fields Conditions
    **/
    $(document).on('click', '.ppom-add-rule', function(e) {

        e.preventDefault();

        var div = $(this).closest('.ppom-slider');
        var option_index = parseInt(div.find('.ppom-condition-last-id').val());
        div.find('.ppom-condition-last-id').val(option_index + 1);

        var field_index = div.find('.ppom-fields-actions').attr('data-field-no');
        var condition_clone = $('.webcontact-rules:last').clone();

        var append_item = div.find('.ppom-condition-clone-js');
        condition_clone.find(append_item).end().appendTo(append_item);

        var field_type = '';
        var add_cond_selector = condition_clone.find('.ppom-conditional-keys');
        ppom_add_condition_set_index(add_cond_selector, field_index, field_type, option_index);

        $('.ppom-slider').find('.webcontact-rules:not(:last) .ppom-add-rule')
            .removeClass('ppom-add-rule').addClass('ppom-remove-rule')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<i class="fa fa-minus" aria-hidden="true"></i>');
    }).on('click', '.ppom-remove-rule', function(e) {

        $(this).parents('.webcontact-rules:first').remove();
        e.preventDefault();
        return false;
    });


    /**
        19- Add Fields Options
    **/
    $(document).on('click', '.ppom-add-option', function(e) {

        e.preventDefault();

        var main_wrapper = $(this).closest('.ppom-slider');
        var ppom_option_type = 'ppom_new_option';

        var li = $(this).closest('li');
        var ul = li.closest('ul');
        var clone_item = li.clone();

        clone_item.find(ul).end().appendTo(ul);

        var option_index = parseInt(ul.find('#ppom-meta-opt-index').val());
        ul.find('#ppom-meta-opt-index').val(option_index + 1);
        // console.log(option_index);

        var field_index = main_wrapper.find('.ppom-fields-actions').attr('data-field-no');
        var option_selector = clone_item.find('.ppom-option-keys');
        var option_controller = clone_item.find('.ppom-fields-option');

        ppom_option_controller(option_controller, field_index, option_index, ppom_option_type);
        ppom_create_option_index(option_selector, field_index, option_index, ppom_option_type);

        // $('.ppom-slider').find('.data-options:not(:last) .ppom-add-option')
        // .removeClass('ppom-add-option').addClass('ppom-remove-option')
        // .removeClass('btn-success').addClass('btn-danger')
        // .html('<i class="fa fa-minus" aria-hidden="true"></i>');
    }).on('click', '.ppom-remove-option', function(e) {

        var selector_btn = $(this).closest('.ppom-slider');
        var option_num = selector_btn.find('.data-options').length;

        if (option_num > 1) {
            $(this).parents('.data-options:first').remove();
        }
        else {
            alert('Cannot Remove More Option');
        }

        e.preventDefault();
        return false;
    });


    /**
        20- Auto Generate Option IDs
    **/
    $(document).on('keyup', '.option-title', function() {

        var closes_id = $(this).closest('li').find('.option-id');
        var option_id = $(this).val().replace(/[^A-Z0-9]/ig, "_");
        option_id = option_id.toLowerCase();
        $(closes_id).val(option_id);
    });


    /**
        21- Create Field data_name By Thier Title
    **/
    $(document).on('keyup', '[data-meta-id="title"] input[type="text"]', function() {

        var $this = $(this);
        var field_id = $this.val().toLowerCase().replace(/[^A-Za-z\d]/g, '_');
        var selector = $this.closest('.ppom-slider');

        var wp_field = selector.find('.ppom-fields-actions').attr('data-table-id');
        if (wp_field == 'shipping_fields' || wp_field == 'billing_fields') {
            return;
        }
        selector.find('[data-meta-id="data_name"] input[type="text"]').val(field_id);
    });


    /**
        22- Fields Sortable
    **/
    function insertAt(parent, element, index, dir) {
        var el = parent.children().eq(index);

        element[dir == 'top' ? 'insertBefore' : 'insertAfter'](el);
    }
    $(".ppom_field_table tbody").sortable({
        stop: function(evt, ui) {

            let parent = $('.ppom_save_fields_model'),
                el = parent.find('.' + ui.item.attr('id')),
                dir = 'top';
            if (ui.offset.top > ui.originalPosition.top) {
                dir = 'bottom';
            }
            insertAt(parent, el, ui.item.index(), dir);
        }
    });


    /**
        23- Fields Option Sortable
    **/
    $(".ppom-options-sortable").sortable();

    $("ul.ppom-options-container").sortable({
        revert: true
    });


    /**
        24- Fields Dataname Must Be Required
    **/
    function ppom_required_data_name($this) {
        var selector = $this.closest('.ppom-slider');
        var data_name = selector.find('[data-meta-id="data_name"] input[type="text"]').val();
        if (data_name == '') {
            var msg = 'Data Name must be required';
            var is_ok = false;
        }
        else {
            msg = '';
            is_ok = true;
        }
        selector.find('.ppom-req-field-id').html(msg);
        return is_ok;
    }


    /**
        WP Color Picker Controller
    **/
    function ppom_wp_color_handler(wpcolor_selector, field_index, option_index) {

        wpcolor_selector.each(function(i, meta_field) {
            var color_picker_input = $(meta_field).find('.ppom-color-picker-init').clone();
            $(meta_field).html(color_picker_input);
            color_picker_input.wpColorPicker();
        });
    }


    /**
        25- Fields Add Option Index Controle Funtion
    **/
    function ppom_create_option_index(option_selector, field_index, option_index, ppom_option_type) {

        option_selector.each(function(i, meta_field) {


            if (ppom_option_type == 'ppom_copy_option') {
                var opt_in = $(meta_field).attr('data-opt-index');
                if (opt_in !== undefined) {
                    option_index = opt_in;
                }
            }
            $(meta_field).attr('data-opt-index', option_index);


            var field_name = 'ppom[' + field_index + '][options][' + option_index + '][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });
    }


    function ppom_option_controller(option_selector, field_index, option_index, ppom_option_type) {

        option_selector.each(function(i, meta_field) {

            // console.log(ppom_option_type);
            if (ppom_option_type == 'ppom_copy_option') {
                var opt_in = $(meta_field).attr('data-opt-index');
                if (opt_in !== undefined) {
                    option_index = opt_in;
                }
            }
            $(meta_field).attr('data-opt-index', option_index);


            var field_name = 'ppom[' + field_index + '][' + $(meta_field).attr('data-optiontype') + '][' + option_index + '][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });
    }


    /**
        26- Fields Add Condition Index Controle Function
    **/
    function ppom_add_condition_set_index(add_c_selector, opt_field_no, field_type, opt_no) {
        add_c_selector.each(function(i, meta_field) {
            // var field_name = 'ppom['+field_no+']['+$(meta_field).attr('data-metatype')+']';
            var field_name = 'ppom[' + opt_field_no + '][conditions][rules][' + opt_no + '][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });
    }

    // address addon
    function ppom_create_address_index(address_selector, field_index, address_table_id) {
        address_selector.each(function(i, meta_field) {
            var field_id = $(meta_field).attr('data-fieldtype');
            var core_field_type = $(address_table_id).attr('data-addresstype');
            var field_name = 'ppom[' + field_index + '][' + core_field_type + '][' + field_id + '][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });
    }


    // eventcalendar inputs changing
    function ppom_eventcalendar_set_index(add_c_selector, opt_field_no) {

        add_c_selector.each(function(i, meta_field) {

            var date = $(meta_field).attr('data-date');
            var field_name = 'ppom[' + opt_field_no + '][calendar][' + date + '][' + $(meta_field).attr('data-metatype') + ']';
            $(meta_field).attr('name', field_name);
        });
    }


    /**
        27- Get All Fields Title On Condition Element Value After Click On Condition Tab
    **/
    // populate_conditional_elements();

    $(document).on('change', 'select[data-metatype="elements"]', function(e) {
        e.preventDefault();

        var element_name = $(this).val();
        var div = $(this).closest('.ppom-slider');

        var selected_rule_box = $(this).closest('.webcontact-rules');
        var element_value_box = selected_rule_box.find('select[data-metatype="element_values"]');

        $(".ppom-slider").each(function(i, item) {

            var data_name = $(item).find('input[data-metatype="data_name"]').val();

            if (data_name == element_name) {

                // resetting
                jQuery(element_value_box).html('');

                $(item).find('.data-options').each(function(i, condition_val) {

                    var condition_type = $(condition_val).attr('data-condition-type');
                    if (condition_type == 'simple_options') {
                        var con_val = $(condition_val).find('input[data-metatype="option"]').val();
                    }
                    else if (condition_type == 'image_options') {
                        var con_val = $(condition_val).find('.ppom-image-option-title').val();
                    }

                    if ($.trim(con_val) !== '') {


                        var val_id = $.trim(con_val);

                        var $html = '';
                        $html += '<option value="' +
                            ppom_escape_html(val_id) + '">' +
                            con_val +
                            '</option>';

                        $($html).appendTo(element_value_box);
                    }
                });
            }
        });
    });

    $(document).on('change', '[data-meta-id="conditions"] select[data-metatype="element_values"]', function(e) {
        e.preventDefault();

        var element_values = $(this).val();
        $(this).attr('data-existingvalue', element_values);
    });

    $(document).on('click', '.ppom-condition-tab-js', function(e) {
        e.preventDefault();

        var div = $(this).closest('.ppom-slider');
        var elements = div.find('select[data-metatype="elements"]');

        elements.each(function(i, item) {

            var conditional_elements = item.value;
            var exiting_meta = $(item).attr('data-existingvalue', conditional_elements);
        });

        populate_conditional_elements(elements);

    });

    function populate_conditional_elements(elements) {

        // resetting
        jQuery('select[data-metatype="elements"]').html('');

        jQuery(".ppom-slider").each(function(i, item) {

            var conditional_elements = jQuery(item).find(
                'input[data-metatype="title"]').val();
            var conditional_elements_value = jQuery(item).find(
                'input[data-metatype="data_name"]').val();

            if ($.trim(conditional_elements_value) !== '') {

                var $html = '';
                $html += '<option value="' +
                    conditional_elements_value + '">' +
                    conditional_elements +
                    '</option>';

                $($html).appendTo('select[data-metatype="elements"]');
            }

        });

        // setting the existing conditional elements
        $(".ppom-slider").each(function(i, item) {

            $(item).find('select[data-metatype="elements"]').each(function(i, condition_element) {

                var existing_value1 = $(condition_element).attr("data-existingvalue");

                if ($.trim(existing_value1) !== '') {
                    jQuery(condition_element).val(existing_value1);
                }

            });
        });



        // setting the existing conditional elements values
        $(".ppom-slider").each(function(i, item) {

            $(item).find('select[data-metatype="element_values"]').each(function(i, condition_element) {

                var div = $(this).closest('.webcontact-rules');
                var existing_value1 = $(condition_element).attr("data-existingvalue");

                div.find('select[data-metatype="elements"]').trigger('change');
                if ($.trim(existing_value1) !== '') {
                    jQuery(condition_element).val(existing_value1);
                }
            });
        });

    }


    /**
        28- validate API WooCommerce Product
    **/
    function validate_api_wooproduct(form) {

        jQuery(form).find("#nm-sending-api").html(
            '<img src="' + nm_personalizedproduct_vars.doing + '">');

        var data = jQuery(form).serialize();
        data = data + '&action=nm_personalizedproduct_validate_api';

        jQuery.post(ajaxurl, data, function(resp) {

            //console.log(resp);
            jQuery(form).find("#nm-sending-api").html(resp.message);
            if (resp.status == 'success') {
                window.location.reload(true);
            }
        }, 'json');


        return false;
    }


    function ppom_escape_html(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
