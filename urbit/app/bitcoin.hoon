::  bitcoin: A Store for Bitcoin using Bcoin as an SPV node
::
/-  *bitcoin-store
/+  *server, default-agent, verb, bip32
::
/=  index
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/index
  /|  /html/
      /~  ~
  ==
/=  tile-js
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/tile
  /|  /js/
      /~  ~
  ==
/=  script
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/index
  /|  /js/
      /~  ~
  ==
/=  style
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/css/index
  /|  /css/
      /~  ~
  ==
/=  bitcoin-png
  /^  (map knot @)
  /:  /===/app/bitcoin/img  /_  /png/
::  State
::
=>  |%
    +$  card  card:agent:gall
    ::
    +$  state
      $%  [%0 state-zero]
      ==
    ::
    +$  state-zero
      $:  =xpub
      ==
    --
::
=|  state-zero
=*  state  -
::  Main
::
%+  verb  |
^-  agent:gall
=<  |_  =bowl:gall
    +*  this          .
        bitcoin-core  +>
        bc            ~(. bitcoin-core bowl)
        def           ~(. (default-agent this %|) bowl)
    ::
    ++  on-init
      ^-  (quip card _this)
      =/  launcha  [%launch-action !>([%bitcoin / '/~bitcoin/js/tile.js'])]
      :_  this(xpub ~)
      :~  [%pass / %arvo %e %connect [~ /'~bitcoin'] %bitcoin]
          [%pass /bitcoin %agent [our.bowl %launch] %poke launcha]
      ==
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      ?>  (team:title our.bowl src.bowl)
      ?+    mark  (on-poke:def mark vase)
          %handle-http-request
        =+  !<([eyre-id=@ta =inbound-request:eyre] vase)
        :_  this
        %+  give-simple-payload:app  eyre-id
        %+  require-authorization:app  inbound-request
        poke-handle-http-request:bc
      ::
          %bitcoin-action
        =^  cards  state
          (handle-bitcoin-action:bc !<(bitcoin-action vase))
        [cards this]
      ==
    ::
    ++  on-watch
      |=  =path
      ^-  (quip card:agent:gall _this)
      ?:  ?=([%http-response *] path)
        `this
      ?.  =(/ path)
        (on-watch:def path)
      [[%give %fact ~ %json !>(*json)]~ this]
    ::
    ++  on-agent  on-agent:def
    ::
    ++  on-arvo
      |=  [=wire =sign-arvo]
      ^-  (quip card _this)
      ?.  ?=(%bound +<.sign-arvo)
        (on-arvo:def wire sign-arvo)
      [~ this]
    ::
    ++  on-save  on-save:def
    ++  on-load  on-load:def
    ++  on-leave  on-leave:def
    ::  +on-peek: read from app state
    ::
    ++  on-peek
      |=  =path
      ^-  (unit (unit cage))
      ?+  path  (on-peek:def path)
          [%x %xpub ~]  ``noun+!>(xpub)
      ==
    ++  on-fail   on-fail:def
    --
::
::
|_  =bowl:gall
::
++  handle-bitcoin-action
  |=  act=bitcoin-action
  ^-  (quip card _state)
  |^
  ?>  (team:title our.bowl src.bowl)
  ?-  -.act
      %add     (handle-add xpub.act)
      %remove  handle-remove
      %derive  (handle-derive +.act)
  ==
  ::
  ++  handle-add
    |=  xpub=tape
    ^-  (quip card _state)
    [~ state(xpub xpub)]
  ::
  ++  handle-remove
    ^-  (quip card _state)
    [~ state(xpub ~)]
  ::
  ++  handle-derive
    ::  // BIP 44: m / purpose' / coin_type' / account' / change / index
    ::
    |=  account=@
    ^-  (quip card _state)
    `state
    :: =/  path=tape  "// m'/44'/0'/{account}'"
    :: (derive-path:(from-extended xpub) path)
  --
::
++  poke-handle-http-request
  |=  =inbound-request:eyre
  ^-  simple-payload:http
  =+  url=(parse-request-line url.request.inbound-request)
  ?+  site.url  not-found:gen
      [%'~bitcoin' %css %index ~]  (css-response:gen style)
      [%'~bitcoin' %js %tile ~]    (js-response:gen tile-js)
      [%'~bitcoin' %js %index ~]   (js-response:gen script)
  ::
      [%'~bitcoin' %img @t *]
    =/  name=@t  i.t.t.site.url
    =/  img  (~(get by bitcoin-png) name)
    ?~  img
      not-found:gen
    (png-response:gen (as-octs:mimes:html u.img))
  ::
      [%'~bitcoin' *]  (html-response:gen index)
  ==
::
--
