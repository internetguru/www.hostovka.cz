<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:param name="inputvar-articlemeta" select="''"/>
  <xsl:param name="inputvar-ghedit2" select="''"/>
  <xsl:param name="inputvar-twitter-title" select="''"/>
  <xsl:param name="inputvar-fb-title" select="''"/>
  <xsl:param name="inputvar-fbcomment-title" select="''"/>
  <xsl:param name="inputvar-fbcomment-ico" select="''"/>
  <xsl:param name="inputvar-facebook-ico" select="''"/>
  <xsl:param name="inputvar-twitter-ico" select="''"/>
  <xsl:param name="inputvar-link-ico" select="''"/>
  <xsl:param name="inputvar-edit-ico" select="''"/>
  <xsl:param name="link" select="''"/>
  <xsl:param name="fbcommentid" select="''"/>

  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="//h1">
    <xsl:element name="div">
      <xsl:attribute name="class">
        <xsl:value-of select="@id"/>
        <xsl:text> hdesc hdesc--top</xsl:text>
      </xsl:attribute>
      <xsl:element name="div">
        <xsl:if test="/body[contains(@class, 'agregator')]">
          <xsl:value-of disable-output-escaping="yes" select="$inputvar-articlemeta"/>
        </xsl:if>
        <xsl:element name="{name()}">
          <xsl:copy-of select="@*"/>
          <xsl:element name="span">
            <xsl:value-of select="."/>
          </xsl:element>
        </xsl:element>
        <div class="hdesc__desc-wrapper">
          <xsl:copy-of select="following-sibling::*[1][name() = 'p'][contains(@class, 'description')]"/>
        </div>
        <!--<xsl:copy-of select="following-sibling::*[name() = 'ul'][contains(@class, 'docinfo')][contains(@class, 'global')]"/>-->
        <xsl:if test="/body[contains(@class, 'agregator')]">
          <div class="extra">
            <ul class="button-list">
              <li>
                <xsl:element name="a">
                  <xsl:attribute name="href">https://www.facebook.com/sharer/sharer.php?u=https://www.hostovka.cz/<xsl:value-of disable-output-escaping="yes" select="$link"/></xsl:attribute>
                  <xsl:attribute name="title"><xsl:value-of disable-output-escaping="yes" select="$inputvar-fb-title"/></xsl:attribute>
                  <xsl:attribute name="class">button button--simple button--img button--img-only</xsl:attribute>
                  <span class="fab fa-fw fa-facebook-square">i</span>
                </xsl:element>
              </li>
              <li>
                <xsl:element name="a">
                  <xsl:attribute name="href">https://twitter.com/intent/tweet?text=www.hostovka.cz/<xsl:value-of disable-output-escaping="yes" select="$link"/></xsl:attribute>
                  <xsl:attribute name="title"><xsl:value-of disable-output-escaping="yes" select="$inputvar-twitter-title"/></xsl:attribute>
                  <xsl:attribute name="class">button button--simple button--img button--img-only</xsl:attribute>
                  <span class="fab fa-fw fa-twitter">i</span>
                </xsl:element>
              </li>
              <li>
                <xsl:value-of disable-output-escaping="yes" select="$inputvar-ghedit2"/>
              </li>
              <li>
                <xsl:element name="button">
                  <xsl:attribute name="title"><xsl:value-of disable-output-escaping="yes" select="$inputvar-print-title"/></xsl:attribute>
                  <xsl:attribute name="class">button__print button button--simple button--img button--img-only eventable</xsl:attribute>
                  <xsl:attribute name="data-eventable-category">print-header</xsl:attribute>
                  <span class="fas fa-fw fa-print">i</span>
                </xsl:element>
              </li>
              <li>
                <span class="hideable hideable-hidden">
                  <span class="eventable button button--simple button--img button--img-only" data-eventable-action="share"><span class="fas fa-fw fa-link">i</span></span>
                  <span class="copyable" fn="inputvar-createlink">
                    <xsl:value-of disable-output-escaping="yes" select="$link"/>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </xsl:if>
      </xsl:element>
    </xsl:element>
    <xsl:element name="div">
      <xsl:call-template name="topdiv"/>
    </xsl:element>
  </xsl:template>

  <xsl:template name="topdiv">
    <xsl:param name="pos" select="1"/>
    <xsl:if test="following-sibling::*[$pos][not(contains(@class, 'section'))]">
      <xsl:if test="following-sibling::*[$pos][not(contains(@class, 'description'))]">
        <xsl:copy-of select="following-sibling::*[$pos]"/>
      </xsl:if>
      <xsl:call-template name="topdiv">
        <xsl:with-param name="pos" select="$pos+1"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>
  

  <!-- ignore elements between h1 and div.section -->
  <xsl:template match="//*[preceding-sibling::h1 and (following-sibling::div[contains(@class, 'section')] or not(//div[contains(@class, 'section')]))]"/>
  <xsl:template match="p[contains(@class, 'description')][preceding-sibling::*[1][name() = 'h1']]"/>
  <!--<xsl:template match="ul[contains(@class, 'docinfo')][contains(@class, 'global')]"/>-->

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
