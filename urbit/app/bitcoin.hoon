::  bitcoin: A Store for Bitcoin using Bcoin as an SPV node
::
::    data:            scry command:
::
::    xpub             .^(tape %gx /=bitcoin=/xpub/noun)
::
/-  *bitcoin
/+  *server, default-agent, verb, bip32, *bitcoin
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
/=  bcoin
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/bcoin
  /|  /js/
      /~  ~
  ==
/=  proxy
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/proxy
  /|  /js/
      /~  ~
  ==
/=  logger
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/logger
  /|  /js/
      /~  ~
  ==
/=  worker
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/worker
  /|  /js/
      /~  ~
  ==
/=  bledger
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/bledger
  /|  /js/
      /~  ~
  ==
/=  bmanager
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bitcoin/js/bmanager
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
      :: :_  this(xpub "tpubD6NzVbkrYhZ4XnhCewQV4KAr7up7HhgQUEbjFYyiBde3Uau2G3zx25wJchZi9Wubh538fyaXsrQZ2pHj8XzyDZpG3PbXG2vv8b6UtkoVaJ3")
      :: :_  this(xpub "tpubDCM6CKkxH8ZLGRWSLzX641zu8Ei8HgfeNsDxg1X9sWY3dCdeFb7XorHgGBA6iWAgCCAinSfYTmt8eF4VxBe7i8EHEZkR8tVLCUwA7DmZhmw")
      :~  launch-poke
          [%pass /bind/bitcoin %arvo %e %connect [~ /'~bitcoin'] %bitcoin]
      ==
    ::
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
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
      ^-  (quip card _this)
      ?:  ?=([%http-response *] path)
        `this
      ?.  =(/primary path)
        ~&  [src.bowl path]
        (on-watch:def path)
      =/  message=json  (frond:enjs:format [%initial b+?:(=(xpub "") | &)])
      [[%give %fact ~ %json !>(message)]~ this]
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
=,  bip32
|_  =bowl:gall
++  launch-poke
  ^-  card
  :*  %pass
      /launch/bitcoin
      %agent
      [our.bowl %launch]
      %poke
      %launch-action
      !>([%add %bitcoin /bitcointile '/~bitcoin/js/tile.js'])
  ==
::
++  derive-poke
  |=  act=bitcoin-action
  ?>  ?=(%derive -.act)
  ^-  card
  [%pass / %agent [ship.act %bitcoin] %poke %bitcoin-action !>(act)]
::
++  receive-poke
  |=  [=ship act=bitcoin-action]
  ^-  card
  [%pass / %agent [ship %bitcoin] %poke %bitcoin-action !>(act)]
::
++  handle-json
  |=  jon=json
  ^-  (quip card _state)
  ?>  (team:title our.bowl src.bowl)
  (handle-bitcoin-action (json-to-bitcoin-action jon))
::
++  handle-bitcoin-action
  |=  act=bitcoin-action
  ^-  (quip card _state)
  |^
  ?-  -.act
      %add      (handle-add xpub.act)
      %remove   handle-remove
      %request  (handle-request [ship.act net.act])
      %derive   (handle-derive [ship.act net.act])
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
    |=  [=ship =network]
    ^-  (quip card _state)
    [[(derive-poke [%derive [ship network]])]~ state]
  ::
  ++  handle-derive
    |=  [account=@ net=network]
    ^-  (quip card _state)
    |^
    =/  addr=@uc  (derive-address random-index net)
      :: %+  derive-address  net
      :: (derivation-path account random-index net)
    :_  state
    ?:  (team:title our.bowl src.bowl)
      ::  Local derive
      ::
      ~&(addr ~)
    ::  Foreign derive
    ::
    [(receive-poke src.bowl [%receive addr])]~
    ::
    ++  derive-address
      |=  [index=@ =network]
      ^-  @uc
      ::  BIP 44: m / purpose' / coin_type' / account' / change / index
      ::  xpub generated with:  m / 44' / network / 0 <- default-account
      ::
      =;  hd-path
        (~(address hd-path +<.hd-path) network)
      =>   [(from-extended xpub) .]
      (derive-path "m/0/{((d-co:co 1) index)}")
      :: =/  hd-initial  (from-extended xpub)
      :: (~(derive-sequence hd-initial +<.hd-initial) ~[0 index])

      ::  Random index for each derivation
      ::
      :: ~&  [network xpub]
      :: =+  (from-extended xpub)
      :: ~&  public-key+`@ux`public-key
      :: =+  (derive-sequence ~[0 0])
      :: ~&  public-key+`@ux`public-key
      :: ~&  (address network)
      :: ~&  identity
      :: ~&  (address network)
      :: 0cmn8xJjYWUAPGrnFCDgTtARWsajjPLZgzEt
      :: ~&  [network (address network)]
      :: ~&  [%main (address %main)]
      :: ~&  [network (pub-extended network)]
      :: ~&  [%main (pub-extended %main)]
      :: ~&  [%identity `@uc`identity]
      :: identity
      :: (derive-path:(from-extended xpub) path)
    ::
    ++  type-from-network
      |=  =network
      ^-  tape
      ?-  network
        %main     "0"
        %regtest  "1"
        %testnet  "1"
      ==
    ::
    ++  derivation-path
      |=  [account=@ index=@ =network]
      ^-  tape
      =-  ~&  -  -
      ::  With an extended public key, we can only derive *non-hardened* keys
      ::
      ::  Warning: (https://bitcoin.stackexchange.com/a/37489) [1]
      ::
      ::  Non-hardened public keys are weaker because if xpubkey is leaked
      ::  together with one of the non-hardened private keys, it would allow
      ::  an attacker to know the private key of the extended public key,
      ::  and all the address derived from it.
      ::
      ::  But, "even if an attacker gets ahold of one of the private keys,
      ::  in situations where the attacker doesn't have access to the extended
      ::  public key, non-hardened is equivalent to hardened security." [1]
      ::
      ::  BIP 44: m / purpose / coin_type / account / change / address_index
      ::
      =/  coin-type=tape  (type-from-network network)
      ~&  coin-type+coin-type
      "m/44/{coin-type}/{((d-co:co 1) account)}/0/{((d-co:co 1) index)}"
    --
  ::
  ++  handle-receive
    |=  address=@uc
    ^-  (quip card _state)
    =/  message=json
      (frond:enjs:format [%address s+(base58-to-cord address)])
    :_  state
    [%give %fact ~[/primary] %json !>(message)]~
  --
::
++  poke-handle-http-request
  |=  =inbound-request:eyre
  ^-  simple-payload:http
  =+  url=(parse-request-line url.request.inbound-request)
  ?+  site.url  not-found:gen
      [%'~bitcoin' %css %index ~]     (css-response:gen style)
      [%'~bitcoin' %js %tile ~]       (js-response:gen tile-js)
      [%'~bitcoin' %js %index ~]      (js-response:gen script)
      [%'~bitcoin' %js %bcoin ~]      (js-response:gen bcoin)
      [%'~bitcoin' %js %proxy ~]      (js-response:gen proxy)
      [%'~bitcoin' %js %logger ~]     (js-response:gen logger)
      [%'~bitcoin' %js %worker ~]     (js-response:gen worker)
      [%'~bitcoin' %js %bledger ~]    (js-response:gen bledger)
      [%'~bitcoin' %js %bmanager ~]   (js-response:gen bmanager)
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
  0
  :: (~(rad og eny.bowl) (pow 2 31))
::
++  parse-btc
  |=  b=@t
  `@uc`(rash b fim:ag)
--
