<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:param name="breadcrumb" select="''"/>
  <xsl:param name="globalmenu" select="''"/>

  <xsl:template match="div[@id='header']/node()">
    <div>
      <xsl:value-of disable-output-escaping="yes" select="$breadcrumb"/>
      <div class="hideable hideable-hidden">
        <div class="hideable-button">Menu</div>
        <div class="globalmenu-top"><xsl:value-of disable-output-escaping="yes" select="$globalmenu"/></div>
      </div>
    </div>
    <xsl:copy-of select="//h1"/>
    <xsl:copy-of select="//h1/following-sibling::*[1]"/>
  </xsl:template>
  
  <xsl:template match="//h1 | /body/div/p[@class='description']"/>

  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>