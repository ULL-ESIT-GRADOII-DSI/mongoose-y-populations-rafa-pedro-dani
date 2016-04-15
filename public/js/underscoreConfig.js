_.templateSettings = {
    interpolate: /\{\{=([^}]*)\}\}/g,
    evaluate: /\{\{(?!=)(.*?)\}\}/g
};

$('#all').html(_.template($('#underscoreContent').html())());
