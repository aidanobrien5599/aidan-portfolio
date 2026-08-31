export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: React.ReactNode;
};

export const posts: BlogPost[] = [
  {
    slug: "self-hosted-email",
    title: "I Set Up My Own Email Server for $22/Year",
    date: "2026-08-30",
    description: "Replacing $300/year in SaaS email with a self-hosted Mox server on a cheap VPS.",
    content: (
      <>
        <p>
          Recently I have been working on tons of new refactors and upgrades to{" "}
          <a href="https://badgerbase.app" target="_blank" rel="noopener noreferrer">BadgerBase</a>{" "}
          using new techniques and tools I picked up at Netflix. While migrating the auth system away
          from Supabase to better-auth, I also realized I wanted a new, cheaper way of sending emails.
        </p>
        <p>
          For almost the entire past year, I have been paying around 25 dollars a month to SendGrid
          just to send several dozen emails a month for authentication and notification services.
          This just seemed silly for the amount of usage it was getting. So choosing my next email
          sender left me with two options:
        </p>
        <ol>
          <li>Scrounge the internet for a cheaper email API.</li>
          <li>Set up my own email service and escape the SaaS matrix.</li>
        </ol>
        <p>
          Problem: there is a reason why SaaS for email exists. In the past, setting up your own
          email was kind of considered a &ldquo;hard&rdquo; thing to do. For something that seems so
          simple, it becomes a very complex system, with things like DNS authentication (SPF, DKIM,
          DMARC), IP reputation, cryptographic key management, TLS certificates, and reverse DNS
          records &mdash; all of which have to be exactly right or your emails will land in spam.
        </p>
        <p>
          But it is 2026, and code is insanely cheap. It is my general philosophy that doing things
          that were considered &ldquo;hard&rdquo; in the past plain and simply are not anymore. And
          it also helps that open source SMTP providers have never been better.
        </p>
        <p>
          With the help of an AI agent, in a couple of hours, I was able to get a working email
          service running on a VPS for a fraction of what I was paying before, going from 300
          dollars a year to a meager 22 dollars.
        </p>
        <p>
          On top of that, I now have limitless fine-grained control over my email, can plug in
          multiple domains to support multiple projects in the future, and am unblocked from the
          terrible usage limits of SaaS of the old ages.
        </p>

        <h2>How I Pulled This Off</h2>
        <p>
          In order to send email programmatically, I needed my own SMTP (Simple Mail Transfer
          Protocol) server. Do not try to build the server from scratch. Email is complicated. There
          are a lot of amazing open source projects that have been painstakingly built and that work.
          The biggest spike was choosing which one to host. Here are some of the notable ones:
        </p>
        <ul>
          <li>
            <strong>Sendmail:</strong> the OG. Written in C in the early 80s. A complicated beast
            and a security nightmare.
          </li>
          <li>
            <strong>Postfix:</strong> its historic successor, written in C in the late 90s. Pretty
            much the industry standard for 25 years. Very solid and can handle millions of messages
            at scale. However, it is only an MTA (mail transfer agent, sending emails), and setting
            up MDA (mail delivery agent, getting emails in an inbox) is a serious pain in the ass.
            While not the direct use case of the server, MDA is critical for the steps needed to get
            a solid IP reputation. You also need OpenDKIM with Postfix to sign outgoing messages. In
            all, it can become too much for a single maintainer and genuinely just doesn&apos;t feel
            like the best option in 2026.
          </li>
          <li>
            <strong>Haraka:</strong> written as a plugin-driven SMTP server in 2010. Has some of
            the same downsides as Postfix in terms of needing external tools like DKIM.
          </li>
          <li>
            <strong>Postal:</strong> self-hosted SendGrid/Mailgun. Has a web UI and everything,
            but it is built for massive scale and needs Ruby + MySQL + RabbitMQ + Redis. So you
            need a machine with at least 4 GB of RAM. Good if you need scale, but at that point
            maybe you should just be using SES.
          </li>
          <li>
            <strong>Mailcow:</strong> similar to Postal in terms of features and having a good UI,
            and runs easily on Docker Compose. The problem again is the machine specs needed.
          </li>
          <li>
            <strong>Mail-in-a-Box:</strong> runs on a single bash script and sets up a complete
            server. Problem: it can be hard to customize, which limits ad-hoc use cases down the
            line.
          </li>
          <li>
            <strong>Mox:</strong> written in Go in 2023 by one beast of an engineer named Mechiel
            Lukkien. It does everything you would need the server to do (SMTP + IMAP + DKIM + SPF +
            DMARC + admin web UI), and its specs are relatively tiny, running comfortably on less
            than 512 MB.
          </li>
          <li>
            <strong>Stalwart:</strong> written in Rust in 2023. Similar to Mox in terms of being
            lightweight, even more featured, has a larger community, but requires a bit more time
            to set up.
          </li>
        </ul>
        <p>
          That list was larger than I expected it to be. But choosing one&apos;s server really does
          come down to needs. If you need something old, reliable, and proven, maybe go with
          Postfix. But I wanted something cool and new, something easy to set up, and something
          that could run on the tiniest machine, so I went with Mox.
        </p>
        <p>
          The next thing I needed was a VPS to run it on. I had an agent scrounge the internet for
          cheap deals, the only requirement being that port 25 be open for SMTP, and ended up with
          a New Year&apos;s deal from RackNerd (it is August).
        </p>
        <p>
          After that, I took my SSH keys and fed them to Claude (sorry security nerds) to go sicko
          mode on the setup. What did it do? I am giving what Claude said verbatim, because I
          actually didn&apos;t do any of this:
        </p>

        <div className="quote-block">
          <p>
            <strong>1. Harden the server.</strong> SSH in, update everything, set up UFW firewall
            rules for the ports you need (22 for SSH, 25 for SMTP, 443 for TLS, 465 for SMTPS, 993
            for IMAP). Basic stuff.
          </p>
          <p>
            <strong>2. Set up DNSSEC-validating DNS.</strong> Mox requires that its DNS resolver
            validates DNSSEC signatures, and the default resolver on most VPS boxes doesn&apos;t. I
            installed Unbound as a local recursive resolver, pointed /etc/resolv.conf to 127.0.0.1,
            and killed systemd-resolved. This is the kind of thing that takes 30 seconds once you
            know you need it, and an hour of debugging if you don&apos;t.
          </p>
          <p>
            <strong>3. Set the hostname.</strong> Mox checks that the machine&apos;s hostname
            matches a DNS record. The VPS shipped with a hostname like racknerd-8259ee4, so I
            changed it to mail.badgerbase.app and pointed an A record at the server&apos;s IP in
            Cloudflare. One gotcha: the DNS record has to be DNS-only (grey cloud in Cloudflare,
            not proxied) because Cloudflare&apos;s proxy doesn&apos;t pass through SMTP traffic.
          </p>
          <p>
            <strong>4. Compile and install Mox.</strong> Mox doesn&apos;t publish prebuilt
            binaries, so you compile it from source with{" "}
            <code>go install github.com/mjl-/mox@v0.0.17</code>. Move the binary to /usr/local/bin
            and you&apos;re good.
          </p>
          <p>
            <strong>5. Run the quickstart.</strong> This is where Mox shines. One command:{" "}
            <code>mox quickstart notifications@badgerbase.app</code>. It generates your config
            files, creates two DKIM RSA-2048 keypairs for key rotation, and prints out every single
            DNS record you need to add. You just copy-paste them into Cloudflare.
          </p>
          <p>
            <strong>6. Set up systemd.</strong> Create a service file so Mox starts on boot and
            restarts on crash. One thing I ran into: Mox&apos;s default service file uses sandbox
            directives (PrivateDevices, ProtectSystem) that don&apos;t work on KVM-based VPS hosts.
            You get a cryptic exit code 226 and nothing in the logs. Strip those directives and it
            runs fine.
          </p>
          <p>
            <strong>7. DNS records.</strong> This is the tedious part. An A record, MX record, SPF,
            two DKIM TXT records, DMARC, and a PTR (reverse DNS) record. If any of these are wrong
            or missing, your email either gets rejected or lands in spam. There&apos;s no helpful
            error message &mdash; it just silently fails. This is what historically made people say
            &ldquo;don&apos;t run your own mail server.&rdquo; It&apos;s not that any individual
            record is hard. It&apos;s that there are six of them, they all have to be exactly right,
            and the feedback loop when something is wrong is terrible.
          </p>
          <p>
            <strong>8. Test and debug.</strong> This is where the fun begins.
          </p>
        </div>

        <p>Wow, that is riveting.</p>

        <h2>Getting Out of the Spam Folder</h2>
        <p>
          After the server was set up, the next challenge was IP reputation work so my emails
          wouldn&apos;t land in spam. Because I am running the service on a crappy cheap VPS, it is
          automatically going to have some initial sending problems.
        </p>
        <p>
          This took about an hour, but if someone was repeating these steps, here would be my advice:
        </p>
        <p>
          Before anything else, make sure SPF, DKIM, and DMARC all show PASS when you check
          &ldquo;Show original&rdquo; in Gmail while test sending from your server. In my case,
          DKIM was failing. I found that my agent ran <code>quickstart</code> multiple times while
          debugging, which generates new keypairs every time, so my DNS keys were out of date.
        </p>
        <p>
          Take advantage of{" "}
          <a href="https://www.mail-tester.com" target="_blank" rel="noopener noreferrer">
            mail-tester.com
          </a>
          . It helped me find that my DKIM was initially broken and also that I was landing on
          Spamhaus&apos; blocklist.
        </p>
        <p>
          The beautiful thing is that since we have MDA on our server, getting off these lists is
          pretty trivial. All you have to do is fill out request forms and verify you are the owner
          of the server.
        </p>
        <p>
          It is also worth checking that you are not on any of these lists either:{" "}
          <a href="https://ipcheck.proofpoint.com" target="_blank" rel="noopener noreferrer">
            Proofpoint
          </a>
          ,{" "}
          <a href="https://mxtoolbox.com/blacklists.aspx" target="_blank" rel="noopener noreferrer">
            MXToolbox
          </a>
          .
        </p>

        <h2>Making Emails Look Legit</h2>
        <p>
          On top of deliverability, here are some things I did to make my emails look more
          professional:
        </p>
        <p>
          Set up a Google account with your sender domain. This way, when you send emails to Gmail
          accounts, your logo or face shows up and looks seriously more professional. This is a
          feature that would cost $90 a year with a Google Workspace email with a custom domain that
          we are now getting for free.
        </p>
        <p>
          Similarly, set up a BIMI record on your domain. BIMI (Brand Indicators for Message
          Identification) is a DNS standard that lets you display your logo next to your emails in
          supporting mail clients. Certain email providers like Yahoo and Apple Mail use it &mdash;
          just host an SVG of your logo and add a DNS TXT record at{" "}
          <code>default._bimi.yourdomain.com</code> pointing to it.
        </p>

        <h2>The Result</h2>
        <p>
          And now I have a fully-functioning, performant, and cheap email provider that works
          across my domains with zero usage limits, that can be reused across future side projects.
          I also now can do fun things like go by the email handle{" "}
          <code>aidan@aidanpobrien.com</code> and set up email-triggered CI/CD.
        </p>
        <p>
          It is clear as to why I would want to do this. I am running a small-scale project that
          doesn&apos;t need an industry-size solution like SES (which is a pain to get approved for
          unless you are a serious company) and wanted cheap, limitless, fine-grained control over
          the system.
        </p>
        <p>
          Total cost: <strong>$21.99/year</strong>. Down from <strong>$300/year</strong>.
          Score on mail-tester.com: <strong>10/10</strong>.
        </p>
      </>
    ),
  },
];
