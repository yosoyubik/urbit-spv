::  bitcoin: A Store for Bitcoin using Bcoin as an SPV node
::
::    data:            scry command:
::
::    xpub             .^(tape %gx /=bitcoin=/xpub/noun)
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
      :_  this(xpub ~)
      :~  launch-poke
          [%pass / %arvo %e %connect [~ /'~bitcoin'] %bitcoin]
      ==
    ::
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      ?>  (team:title our.bowl src.bowl)
      ?+    mark  (on-poke:def mark vase)
          %json
        =^  cards  state
          (handle-json:bc !<(json vase))
        [cards this]
      ::
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
          [%x %xpub ~]     ``noun+!>(xpub)
      ==
    ++  on-fail   on-fail:def
    --
::
::
=,  bip32
|_  =bowl:gall
++  handle-json
  |=  jon=json
  ^-  (quip card _state)
  |^
  ?>  (team:title our.bowl src.bowl)
  (handle-bitcoin-action (json-to-btc-action jon))
  ::
  ++  json-to-btc-action
    |=  jon=json
    ^-  bitcoin-action
    =,  dejs:format
    =<  (parse-json jon)
    |%
    ++  parse-json
      %-  of
      [%request (cu @p (su fed:ag))]~
    --
  --
::
++  handle-bitcoin-action
  |=  act=bitcoin-action
  ^-  (quip card _state)
  |^
  ?-  -.act
      %add      (handle-add xpub.act)
      %remove   handle-remove
      %request  (handle-request ship.act)
      %derive   (handle-derive ship.act)
      %receive  (handle-receive +.act)
  ==
  ::
  ++  handle-add
    |=  xpub=tape
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    [~ state(xpub xpub)]
  ::
  ++  handle-remove
    ^-  (quip card _state)
    ?>  (team:title our.bowl src.bowl)
    [~ state(xpub ~)]
  ::
  ++  handle-request
    |=  =ship
    ^-  (quip card _state)
    [[(derive-poke ship)]~ state]
  ::
  ++  handle-derive
    |=  account=@
    ^-  (quip card _state)
    |^
    =/  addr=@uc
      (derive-address (derivation-path account random-index))
    :_  state
    ?:  (team:title our.bowl src.bowl)
      ::  Local derive
      ::
      ~&(addr ~)
    ::  Foreign derive
    ::
    [(receive-poke src.bowl addr)]~
    ::
    ++  derive-address
      |=  path=tape
      ^-  @uc
      =<  identity
      (derive-path:(from-extended xpub) path)
    ::
    ++  derivation-path
      |=  [account=@ index=@]
      ::  BIP 44: m / purpose / coin_type / account / change / address_index
      ::
      "m/44/0/{((d-co:co 1) account)}/0/{((d-co:co 1) index)}"
    --
  ::
  ++  handle-receive
    |=  address=@uc
    :_  state
    [%give %fact ~[/bitcointile] %json !>(s+(base58-to-cord address))]~
  --
::
++  derive-poke
  |=  =ship
  ^-  card
  [%pass / %agent [ship %bitcoin] %poke %derive !>(ship)]
::
++  receive-poke
  |=  [=ship address=@uc]
  ^-  card
  [%pass / %agent [ship %bitcoin] %poke %receive !>(address)]
::
++  launch-poke
  ^-  card
  :*  %pass
      /bitcoin
      %agent
      [our.bowl %launch]
      %poke
      [%launch-action !>([%bitcoin /bitcointile '/~bitcoin/js/tile.js'])]
  ==
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
++  base58-to-cord
  |=  b=@uc
  ^-  @t
  ::  Removes leading 0c
  ::
  (rsh 3 2 (scot %uc b))
::
++  random-index
  ^-  @ud
  (~(rad og eny.bowl) (pow 2 31))
::
++  parse-btc
  |=  b=@t
  `@uc`(rash b fim:ag)
--
