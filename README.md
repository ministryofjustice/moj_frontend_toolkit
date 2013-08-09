MOJFrontEndToolkit
==================

Intended to provide a consistent CSS/JS/Assets starting point for MOJ apps.

If this is to be used in a Rails project, include the [Gem wrapper repo](https://github.com/ministryofjustice/moj_frontend_toolkit_gem), which includes the latest version of this repo. Use outside of the Gem in a non-rails project is at your own risk, but the assets should work ok as long as your project can speak Sass.

This repo lives inside the Gem repo as a subtree under `/app/` so that the assets and views folders are supplied by the asset pipeline at `/app/assets/` and `/app/views/` respectively. This means thast as well as the CSS, image and JS assets, certain fragments of HAML are supplied as well.

At the time of writing these are:

    _footer.html.haml
    _head.html.haml
    _header.html.haml
    _moj_footer.html.haml
    _moj_footergov.html.haml
    _moj_header.html.haml
    _moj_headergov.html.haml
    _phase_indicator.html.haml
    _script.html.haml

Have a look at each of these and you should get a feel for what they do. The files are very prosriptive of the layout in current MOJ apps/sites, and are meant to be a shortcut to getting off the ground quickly with a new project as opposed to being flexible and versatile and trying to cover every angle.

Configuration
-------------

In order for these files to work, you will need to set a number of variables in your `application.rb` for things like project title, current phase, etc. If you are encountering errors when trying to use the toolkit, make sure the following are set inside your `class Application` (example values from a current project provided):

    # app title appears in the header bar
    config.app_title = 'Form finder'

    # phase governs text indicators and highlight colours
    # presumed values: alpha, beta, live
    config.phase = 'alpha'

    # known values: information, service
    config.product_type = 'service'

    # govbranding switches on or off the crown logo, full footer and NTA font
    config.govbranding = false

    # feedback_email is the address linked in the alpha/beta bar asking for feedback
    config.feedback_email = 'test@example.com'

At the time of writing, `config.product_type` is not used but is possibly to be used in the near future so it stays for now.

You will additionally need to precompile the assets supplied by the toolkit by adding the following (also in your `class Application`):

    config.assets.enabled = true
    config.assets.precompile += %w(
      gov-static/gov-goodbrowsers.css
      gov-static/gov-ie6.css
      gov-static/gov-ie7.css
      gov-static/gov-ie8.css
      moj-base.css
      gov-static/gov-ie.js
    )

Now in your layouts you can render header and footer includes in the usual way to pull in the files above, which will give you the header and footer determined by your configuration.

A sample `application.html.haml` layout might look like this (real example taken from current project):

    !!!
    %html
      %head
        = render "shared/head", :title => Rails.configuration.app_title

      %body{:class => body_class()}

        = render "shared/header"

        #wrapper.group
          = render "shared/phase_indicator"
          %section#content.group{:role => "main"}
            .full-width-group
              = yield

        = render "shared/footer"
        
        = render "shared/script"

That `body_class()` is in the application helper and simply looks like:

    def body_class
      Rails.configuration.phase + " " + Rails.configuration.product_type
    end

