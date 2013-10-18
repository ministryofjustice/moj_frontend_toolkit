MOJFrontEndToolkit
==================

Intended to provide a consistent CSS/JS/Assets starting point for MOJ apps.

**NOTE:** The Sass files expect to be able to find files from the GOV.UK Frontend Toolkit such as `_colours.scss` and `_css3.scss`, so you **must** either include the [GOV.UK Frontend Toolkit Gem](https://github.com/alphagov/govuk_frontend_toolkit_gem) in your project (if it's a RoR project, recommended), or include the files directly by grabbing them from the original [GOV.UK Frontend Toolkit repo](https://github.com/alphagov/govuk_frontend_toolkit) and adding them to your assets.

If this is to be used in a Rails project, include the [Gem wrapper repo](https://github.com/ministryofjustice/moj_frontend_toolkit_gem), which includes the latest version of this repo. Use outside of the Gem in a non-rails project is at your own risk, but the assets should work ok as long as your project can speak Sass.

This repo lives inside the Gem repo as a subtree under `/app/` so that the *assets* and *views* folders are supplied by the asset pipeline at `/app/assets/` and `/app/views/` respectively. This means that as well as the CSS, image and JS assets, certain fragments of HAML are supplied as well.

Partials
--------

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

Have a look at each of these and you should get a feel for what they do. The files are very proscriptive of the layout in current MOJ apps/sites, and are meant to be a shortcut to getting off the ground quickly with a new project as opposed to being flexible and versatile and trying to cover every angle.

Assets
------

Use the `head` include above in the `HEAD` of your template with this line:

    = render "shared/head", :title => foo

and this will include the application CSS files for all browsers by way of precompiled manifests, as well as conditional JS for versions of IE. Have a look at `_head.html.haml` and you'll see what I mean. To then include the MOJ specific CSS, add this line to the require block in your `/app/assets/application.css`:

     *= require moj-base



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

You will additionally need to precompile the assets supplied by the toolkit by adding the following (also in your `class Application`):

    config.assets.enabled = true
    config.assets.precompile += %w(
      gov-static/gov-goodbrowsers.css
      gov-static/gov-ie6.css
      gov-static/gov-ie7.css
      gov-static/gov-ie8.css
      gov-static/gov-print.css
      gov-static/gov-fonts.css
      gov-static/gov-fonts-ie8.css
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

so feel free to copy that or roll your own.

Modules
-------

See [wiki pages](https://github.com/ministryofjustice/moj_frontend_toolkit/wiki) for help on modules.

Changelog
---------

#### v0.0.43 (2013-10-18)
  * Added responsive styling to phase indicator

#### v0.0.42 (2013-10-17)
  * Added view for global cookie message
  * Added JS module to handle cookie message display