const i18n = key => translations.trans[config.lang][key];

function calculateDays(dateString) {
    // calculate day difference and show different message
    var targetDate = new Date(dateString);
    var today = new Date();
    var timeDiff = targetDate.getTime() - today.getTime();
    var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (dayDiff > 0) {
        return i18n('dayFuture').replace('${dayDiff}', dayDiff);
    } else if (dayDiff < 0) {
        return i18n('dayPast').replace('${dayDiff}', Math.abs(dayDiff));
    } else {
        return i18n('today');
    }
}

class countDownWidget extends api.NoteContextAwareWidget {
    get position() {
        return 100;
    }
    get parentWidget() {
        return 'center-pane';
    }

    isEnabled() {
        return super.isEnabled();
    }
    
    doRender() {
        this.$widget = $(`
<style>
.countdown-div{
color: ${config.messageColor};
position: relative !important;
top: -10px;
}
</style>`);
        return this.$widget;
    }

    async refreshWithNote(note) {
        $(document).ready(function () {
            // only enable in date note
            if (!note.hasLabel("dateNote")){
                $('.countdown-div').remove();
                return;
            }
            
            var noteDate = note.getLabelValue("dateNote");
            var message = calculateDays(noteDate);
            console.log(message);
            
            // put the message below note title
            var container = $("div.note-split:not(.hidden-ext) .note-title-widget");
            if (!container.children().hasClass('countdown-div')) {
                var messageHtml = $(`
                <div class="countdown-div" style="">
                    <div class="countdown-message">${message}</div>
                </div>
                `);
                container.append(messageHtml);
            } else {
                $(".countdown-message")[0].innerHTML = message;
            }
        });
    }
    
}

module.exports = new countDownWidget();