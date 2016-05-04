(function($) {
    "use strict";

    $(function() {
        $('.vauxooci-display').click(function() {
            console.log( $(this).data('target-id'));

            if ( $('#'+$(this).data('target-id')).hasClass( "hidden"  )  ) {
                $('#'+$(this).data('target-id')).removeClass('hidden');
                return true
            }
            $('#'+$(this).data('target-id')).addClass('hidden');
       });
    });

})(jQuery);
