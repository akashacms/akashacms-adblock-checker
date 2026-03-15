function akAdblockChecker(adblockSelector, adblockCodeOnBlocked) {
    // console.log(`akAdblockChecker ${adblockSelector}`, adblockCodeOnBlocked);
    $(adblockSelector).each(function() {
        // console.log('height='+ $(this).height());
        // console.log('innerHeight='+ $(this).innerHeight());
        if ($(this).height() <= 0) {
            // $(this).append('<div style="border: 1px solid red"><strong>AdBlocker detected</strong><br/><p>Please consider adding this site to your ad blocker whitelist.</p></div>');
            $(this).append(atob(adblockCodeOnBlocked));
        }
    });
}