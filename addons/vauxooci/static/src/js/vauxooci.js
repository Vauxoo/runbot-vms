(function($) {
    "use strict";

    $(function() {
        $('.vauxooci-display').click(function() {

            if ( $('#'+$(this).data('target-id')).hasClass( "hidden"  )  ) {
                $('#'+$(this).data('target-id')).removeClass('hidden');
                return true
            }
            $('#'+$(this).data('target-id')).addClass('hidden');
        });
        $('.build-card').click(function() {
            var self = $(this);
            $.ajax({
                url: "/vauxooci/build_button/"+self.data('build-id'),
                context: document.body
            }).done(function(data) {
                    var res = $(data).css({"position": "fixed",
                                 "top": 0,
                                 "left": 0,
                             }).data('build-id',
                                     self.data('build-id'));
                    res.appendTo($('body'));
            });
       });
    });

})(jQuery);
