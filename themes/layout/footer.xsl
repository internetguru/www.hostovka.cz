<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:param name="cms-title" select="''"/>
  <xsl:param name="breadcrumb" select="''"/>
  <xsl:param name="globalmenu" select="''"/>
  <xsl:param name="agregator-filepath" select="''"/>

  <xsl:param name="cms-lang" select="''"/>
  <xsl:param name="cms-author" select="''"/>
  <xsl:param name="cms-authorid" select="''"/>
  <xsl:param name="cms-resp" select="''"/>
  <xsl:param name="cms-respid" select="''"/>
  <xsl:param name="cms-ctime" select="''"/>
  <xsl:param name="cms-mtime" select="''"/>
  <xsl:param name="cms-version" select="''"/>
  <xsl:param name="cms-name" select="''"/>
  <xsl:param name="cms-desc" select="''"/>
  <xsl:param name="cms-kw" select="''"/>
  <xsl:param name="cms-url" select="''"/>
  <xsl:param name="cms-uri" select="''"/>
  <xsl:param name="cms-link" select="''"/>
  <xsl:param name="cms-logged_user" select="''"/>
  <xsl:param name="cms-super_user" select="''"/>
  <xsl:param name="cms-admin_id" select="''"/>

  <xsl:param name="contentlink-lang" select="''"/>
  <xsl:param name="contentlink-author" select="''"/>
  <xsl:param name="contentlink-authorid" select="''"/>
  <xsl:param name="contentlink-resp" select="''"/>
  <xsl:param name="contentlink-respid" select="''"/>
  <xsl:param name="contentlink-ctime" select="''"/>
  <xsl:param name="contentlink-mtime" select="''"/>

  <xsl:param name="inputvar-myctime" select="''"/>
  <xsl:param name="inputvar-mymtime" select="''"/>
  <xsl:param name="inputvar-linkmtime" select="''"/>
  <xsl:param name="inputvar-linkctime" select="''"/>
  <xsl:param name="inputvar-creation" select="''"/>
  <xsl:param name="inputvar-cyear" select="''"/>
  <xsl:param name="inputvar-year" select="''"/>
  <xsl:param name="inputvar-service" select="''"/>
  <xsl:param name="inputvar-resp" select="''"/>
  <xsl:param name="inputvar-mtime" select="''"/>
  <xsl:param name="inputvar-feedback-cs" select="''"/>
  <xsl:param name="inputvar-feedback-en" select="''"/>

  <xsl:variable name="copy">
    <xsl:choose>
      <xsl:when test="$inputvar-cyear = $inputvar-year">©&#160;<xsl:value-of disable-output-escaping="yes" select="$inputvar-cyear"/></xsl:when>
      <xsl:otherwise>©&#160;<xsl:value-of disable-output-escaping="yes" select="$inputvar-cyear"/>–<xsl:value-of disable-output-escaping="yes" select="$inputvar-year"/></xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <xsl:template match="/body">
    <body>
      <xsl:copy-of select="@*"/>
      <xsl:apply-templates/>
      <div id="footer">
        <xsl:value-of disable-output-escaping="yes" select="$globalmenu"/>
        <ul class="footer-menu">
          <li class="footer-menu__item sponzor">
            Sponzor webu: <a href="https://www.steakgrill.cz/">restaurace STEAKGRILL</a> <a href="https://www.steakgrill.cz/"><img src="/files/sg.png" alt="Restaurace STEAKGRILL"/></a>
          </li>
        </ul>
        <ul class="footer-menu">
          <xsl:attribute name="lang">
            <xsl:value-of disable-output-escaping="yes" select="$cms-lang"/>
          </xsl:attribute>
          <li class="footer-menu__item"><xsl:value-of disable-output-escaping="yes" select="$copy"/>&#160;
            <xsl:choose>
              <xsl:when test="$cms-authorid">
                <a>
                  <xsl:attribute name="href"><xsl:value-of disable-output-escaping="yes" select="$cms-authorid"/></xsl:attribute>
                  <xsl:value-of disable-output-escaping="yes" select="$cms-author"/>
                </a>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of disable-output-escaping="yes" select="$cms-author"/>
              </xsl:otherwise>
            </xsl:choose>
           </li>
          <xsl:if test="$inputvar-service">
            <li class="footer-menu__item footer-menu__item--service"><xsl:value-of disable-output-escaping="yes" select="$inputvar-service"/></li>
          </xsl:if>
          <xsl:if test="$cms-resp">
            <li class="footer-menu__item"><xsl:value-of disable-output-escaping="yes" select="$inputvar-resp"/></li>
          </xsl:if>
          <xsl:if test="$cms-mtime">
            <li class="footer-menu__item"><xsl:value-of disable-output-escaping="yes" select="$inputvar-mtime"/></li>
          </xsl:if>
          <li class="footer-menu__item">
            <xsl:choose>
              <xsl:when test="$cms-lang = 'cs'">
                <xsl:if test="$inputvar-feedback-cs">
                  <xsl:value-of disable-output-escaping="yes" select="$inputvar-feedback-cs"/>
                </xsl:if>
              </xsl:when>
              <xsl:otherwise>
                <xsl:if test="$inputvar-feedback-en">
                  <xsl:value-of disable-output-escaping="yes" select="$inputvar-feedback-en"/>
                </xsl:if>
              </xsl:otherwise>
            </xsl:choose>
          </li>
          <li class="print"><xsl:value-of select="$cms-uri"/></li>
        </ul>
      </div>
    </body>
  </xsl:template>

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
