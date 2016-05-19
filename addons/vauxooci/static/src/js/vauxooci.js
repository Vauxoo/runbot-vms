(function($) {
    "use strict";
    $(function() {
        var controls = [];
        // Show/Hide the XS builds
        $('.vauxooci-display-xs').click(function() {

            if ( $('#'+$(this).data('target-id') ).hasClass( "hidden" ) ) {
                $('#'+$(this).data('target-id')).removeClass('hidden');
                return true
            }
            $('#'+$(this).data('target-id')).addClass('hidden');
        });
        // Show/Hide the MD-LG builds
        $('.vauxooci-display').click(function() {

            if ( $('#'+$(this).data('target-id')).hasClass( "hidden" )) {
                $('#'+$(this).data('target-id')).removeClass('hidden');
                return true
            }
            $('#'+$(this).data('target-id')).addClass('hidden');
        });
        $('.expand-all').click(function() {
            $(".vauxooci-display").trigger("click");
        });
        $('.build-card').click(function(e) {
            var self = $(this),
                x = e.pageX,
                y = e. pageY

            if ($(window).width() < 900) {
                x = 0;
                y = 450;
                console.log(x);
                console.log(y)
            }


            // if there is any other button then delete it.
            if ($('.btn-background')) {
                $('.btn-background').remove();
            }

            // Bring the buttons alive
            $.ajax({
                url: "/vauxooci/build_button/"+self.data('build-id'),
                context: document.body
            })
            .done(function(data) {
                var res = $(data)
                    .css({
                        "position": "fixed",
                        "top": y,
                        "left": x,
                        "z-index": 5000,
                     })
                    .data('build-id', self.data('build-id'));

                var closebutton = res.find('.close'),
                    closing = 1
                closebutton.click(function(){
                    res.remove()
                });
                if (closing == 1) {
                    closing = 0;
                }
                if (closing != 1) {
                    res.appendTo($('body'));
                }
            }).error(function(errorvalue){
                 console.log(errorvalue);
            });
       });
    });

})(jQuery);
